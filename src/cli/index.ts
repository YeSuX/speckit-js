import { program } from "commander";
import { showBanner } from "../utils/showBanner";
import { StepTracker } from "../core/StepTracker";

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
    .action(() => {
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

      tracker.display();
      // TODO: 实现构建逻辑
    });

  // 解析命令行参数
  program.parse();
}

// 错误处理
main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
