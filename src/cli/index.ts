import { program } from "commander";
import { showBanner } from "../utils/showBanner";
import { StepTracker } from "../core/StepTracker";
import { checkToolForTracker } from "../utils/checkToolForTracker";

// 工具配置
const toolConfigs = [
  { name: "git", description: "Git version control", url: "https://git-scm.com/downloads" },
  { name: "claude", description: "Claude Code CLI", url: "https://docs.anthropic.com/en/docs/claude-code/setup" },
  { name: "gemini", description: "Gemini CLI", url: "https://github.com/google-gemini/gemini-cli" },
  { name: "qwen", description: "Qwen Code CLI", url: "https://github.com/QwenLM/qwen-code" },
  { name: "code", description: "VS Code (for GitHub Copilot)", url: "https://code.visualstudio.com/" },
  { name: "cursor-agent", description: "Cursor IDE agent (optional)", url: "https://cursor.sh/" },
  { name: "windsurf", description: "Windsurf IDE (optional)", url: "https://windsurf.com/" },
  { name: "opencode", description: "opencode", url: "https://opencode.ai/" },
  { name: "codex", description: "Codex CLI", url: "https://github.com/openai/codex" }
];

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

      // 添加所有工具到跟踪器
      toolConfigs.forEach((tool) => {
        tracker.add(tool.name, tool.description);
      });

      // 存储检查结果
      const results: Record<string, boolean> = {};

      // 检查大部分工具
      for (const tool of toolConfigs) {
        if (tool.name === "code") {
          // VS Code 特殊逻辑：先检查 code，如果失败则检查 code-insiders
          let codeOk = await checkToolForTracker("code", tool.url, tracker);
          if (!codeOk) {
            codeOk = await checkToolForTracker(
              "code-insiders",
              "https://code.visualstudio.com/insiders/",
              tracker
            );
          }
          results[tool.name] = codeOk;
        } else {
          results[tool.name] = await checkToolForTracker(
            tool.name,
            tool.url,
            tracker
          );
        }
      }

      // 显示最终结果
      tracker.display();

      // 输出检查结果统计
      const stats = tracker.getStatistics();
      console.log(
        `\n📊 检查完成: ${stats.done} 个工具可用, ${stats.error} 个工具缺失`
      );

      console.log("\n\x1b[1m\x1b[32mSpeckit cli 已准备好使用!\x1b[0m");

      // 提示信息
      if (!results.git) {
        console.log("\x1b[2m提示：安装 git 进行存储库管理\x1b[0m");
      }

      // 检查是否有任何 AI 助手可用
      const aiTools = [
        "claude",
        "gemini",
        "cursor-agent",
        "qwen",
        "windsurf",
        "opencode",
        "codex",
      ];
      const hasAnyAI = aiTools.some((tool) => results[tool]);

      if (!hasAnyAI) {
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