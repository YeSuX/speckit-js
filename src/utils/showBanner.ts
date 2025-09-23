export const showBanner = () => {
  const rainbowColors = [
    "\x1b[91m", // 亮红
    "\x1b[93m", // 亮黄
    "\x1b[92m", // 亮绿
    "\x1b[96m", // 亮青
    "\x1b[94m", // 亮蓝
    "\x1b[95m", // 亮紫
  ];

  const text = "SPECKIT";
  let coloredText = "";

  for (let i = 0; i < text.length; i++) {
    const colorIndex = i % rainbowColors.length;
    coloredText += `${rainbowColors[colorIndex]}\x1b[1m${text[i]}\x1b[0m`;
  }

  const banner = `
  ███████╗██████╗ ███████╗ ██████╗██╗  ██╗██╗████████╗
  ██╔════╝██╔══██╗██╔════╝██╔════╝██║ ██╔╝██║╚══██╔══╝
  ███████╗██████╔╝█████╗  ██║     █████╔╝ ██║   ██║   
  ╚════██║██╔═══╝ ██╔══╝  ██║     ██╔═██╗ ██║   ██║   
  ███████║██║     ███████╗╚██████╗██║  ██╗██║   ██║   
  ╚══════╝╚═╝     ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝   
`;

  // 对 banner 的每一行应用彩虹色
  const lines = banner.split("\n");
  const coloredBanner = lines
    .map((line, lineIndex) => {
      if (line.trim() === "") return line;

      let coloredLine = "";
      let charIndex = 0;

      for (let i = 0; i < line.length; i++) {
        if (line[i] !== " ") {
          const colorIndex = (lineIndex + charIndex) % rainbowColors.length;
          coloredLine += `${rainbowColors[colorIndex]}\x1b[1m${line[i]}\x1b[0m`;
          charIndex++;
        } else {
          coloredLine += line[i];
        }
      }

      return coloredLine;
    })
    .join("\n");

  console.log(coloredBanner);
  console.log(
    "\x1b[93m\x1b[1m    🌈 用于规范驱动开发的现代 TypeScript/JavaScript 工具包\x1b[0m"
  );
  console.log("");
};
