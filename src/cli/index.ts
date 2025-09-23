import { program } from "commander";
import { showBanner } from "../utils/showBanner";
import { StepTracker } from "../core/StepTracker";
import { checkToolForTracker } from "../utils/checkToolForTracker";

async function main() {
  // 显示banner
  //   showBanner();

  // 配置CLI程序
  program
    .name("speckit")
    .description(
      "A modern TypeScript/JavaScript toolkit for Spec-Driven Development"
    );
  // .version(version);

  // 添加基础命令
  program
    .command("init")
    .description("Initialize a new spec project")
    .action(() => {
      console.log("🎉 Initializing new spec project...");
      // TODO: 实现初始化逻辑
    });

  program
    .command("check")
    .description("正在检查已安装的工具...")
    .action(async () => {
      showBanner();
      const tracker = new StepTracker("检查已安装的工具");

      tracker.add("git", "Git version control");
      tracker.add("claude", "Claude Code CLI");
      tracker.add("gemini", "Gemini CLI");
      tracker.add("qwen", "Qwen Code CLI");
      tracker.add("code", "VS Code (for GitHub Copilot)");
      tracker.add("cursor-agent", "Cursor IDE agent (optional)");
      tracker.add("windsurf", "Windsurf IDE (optional)");
      tracker.add("opencode", "opencode");
      tracker.add("codex", "Codex CLI");

      // 转换后的工具检查逻辑
      const gitOk = await checkToolForTracker(
        "git",
        "https://git-scm.com/downloads",
        tracker
      );
      const claudeOk = await checkToolForTracker(
        "claude",
        "https://docs.anthropic.com/en/docs/claude-code/setup",
        tracker
      );
      const geminiOk = await checkToolForTracker(
        "gemini",
        "https://github.com/google-gemini/gemini-cli",
        tracker
      );
      const qwenOk = await checkToolForTracker(
        "qwen",
        "https://github.com/QwenLM/qwen-code",
        tracker
      );

      // VS Code 特殊逻辑：先检查 code，如果失败则检查 code-insiders
      let codeOk = await checkToolForTracker(
        "code",
        "https://code.visualstudio.com/",
        tracker
      );
      if (!codeOk) {
        codeOk = await checkToolForTracker(
          "code-insiders",
          "https://code.visualstudio.com/insiders/",
          tracker
        );
      }

      const cursorOk = await checkToolForTracker(
        "cursor-agent",
        "https://cursor.sh/",
        tracker
      );
      const windsurfOk = await checkToolForTracker(
        "windsurf",
        "https://windsurf.com/",
        tracker
      );
      const opencodeOk = await checkToolForTracker(
        "opencode",
        "https://opencode.ai/",
        tracker
      );
      const codexOk = await checkToolForTracker(
        "codex",
        "https://github.com/openai/codex",
        tracker
      );

      // 显示最终结果
      tracker.display();

      // 可选：输出检查结果统计
      const stats = tracker.getStatistics();
      console.log(
        `\n📊 检查完成: ${stats.done} 个工具可用, ${stats.error} 个工具缺失`
      );

      console.log("\n\x1b[1m\x1b[32mSpeckit cli 已准备好使用!\x1b[0m");

      if (!gitOk) {
        console.log("\x1b[2m提示：安装 git 进行存储库管理\x1b[0m");
      }

      if (
        !(
          claudeOk ||
          geminiOk ||
          cursorOk ||
          qwenOk ||
          windsurfOk ||
          opencodeOk ||
          codexOk
        )
      ) {
        console.log("\x1b[2m提示：安装 AI 助手以获得最佳体验\x1b[0m");
      }
    });

  // 解析命令行参数
  program.parse();
}

// 错误处理
main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
