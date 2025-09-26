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
    .command("init [project-name]")
    .description("初始化一个新的规范项目")
    .option(
      "--ai <assistant>",
      "要使用的AI助手: claude, gemini, copilot, cursor, qwen, opencode, codex, 或 windsurf"
    )
    .option(
      "--ignore-agent-tools",
      "跳过AI代理工具检查（如Claude Code）",
      false
    )
    .option("--no-git", "跳过git仓库初始化", false)
    .option("--here", "在当前目录初始化项目而不是创建新目录", false)
    .option("--skip-tls", "跳过SSL/TLS验证（不推荐）", false)
    .option("--debug", "显示详细的网络和提取失败诊断输出", false)
    .option(
      "--github-token <token>",
      "用于API请求的GitHub令牌（或设置GH_TOKEN或GITHUB_TOKEN环境变量）"
    )
    .action((projectName, options) => {
      console.log("🎉 正在初始化新的规范项目...");

      // 参数处理
      const config = {
        projectName: projectName || null, // 项目名称
        aiAssistant: options.ai || null, // AI助手
        scriptType: options.script || null, // 脚本类型
        ignoreAgentTools: options.ignoreAgentTools || false, // 忽略代理工具
        noGit: options.noGit || false, // 不使用git
        here: options.here || false, // 在当前目录
        skipTls: options.skipTls || false, // 跳过TLS
        debug: options.debug || false, // 调试模式
        githubToken:
          options.githubToken ||
          process.env.GH_TOKEN ||
          process.env.GITHUB_TOKEN ||
          null, // GitHub令牌
      };

      // 从最新模板初始化一个新的 Specify 项目。

      //     此命令将会：
      //     1. 检查所需工具是否已安装（git 是可选的）
      //     2. 让您选择您的 AI 助手（Claude Code、Gemini CLI、GitHub Copilot、Cursor、Qwen Code、opencode、Codex CLI 或 Windsurf）
      //     3. 从 GitHub 下载相应的模板
      //     4. 将模板提取到新的项目目录或当前目录
      //     5. 初始化一个全新的 git 仓库（如果没有使用 --no-git 且不存在现有仓库）
      //     6. 可选择设置 AI 助手命令

      showBanner();

      // 添加参数验证逻辑
      if (config.here && config.projectName) {
        console.error(
          "\x1b[31mError:\x1b[0m 无法同时指定 [项目名称] 和 --here 标志"
        );
        process.exit(1);
      }

      if (!config.here && !config.projectName) {
        console.error(
          "\x1b[31mError:\x1b[0m 必须指定 [项目名称] 或使用 --here 标志"
        );
        process.exit(1);
      }

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
    });
}

// 错误处理
main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});