import { program } from "commander";

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
    .command("build")
    .description("Build spec files")
    .action(() => {
      console.log("🔨 Building spec files...");
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
