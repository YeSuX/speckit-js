// src/core/StepTracker.ts

/**
 * 步骤状态枚举
 */
export enum StepStatus {
  PENDING = "pending",
  RUNNING = "running",
  DONE = "done",
  ERROR = "error",
  SKIPPED = "skipped",
}

/**
 * 步骤接口定义
 */
export interface Step {
  key: string;
  label: string;
  status: StepStatus;
  detail: string;
}

/**
 * 刷新回调函数类型
 */
export type RefreshCallback = () => void;

/**
 * 步骤跟踪器类
 * 跟踪和渲染分层步骤，不使用 emoji，类似于 Claude Code 树输出
 * 支持通过附加的刷新回调进行实时自动刷新
 */
export class StepTracker {
  private title: string;
  private steps: Step[] = [];
  private statusOrder: Record<StepStatus, number> = {
    [StepStatus.PENDING]: 0,
    [StepStatus.RUNNING]: 1,
    [StepStatus.DONE]: 2,
    [StepStatus.ERROR]: 3,
    [StepStatus.SKIPPED]: 4,
  };
  private refreshCallback?: RefreshCallback;

  constructor(title: string) {
    this.title = title;
  }

  /**
   * 附加刷新回调
   */
  attachRefresh(callback: RefreshCallback): void {
    this.refreshCallback = callback;
  }

  /**
   * 添加步骤
   */
  add(key: string, label: string): void {
    const existingStep = this.steps.find((s) => s.key === key);
    if (!existingStep) {
      this.steps.push({
        key,
        label,
        status: StepStatus.PENDING,
        detail: "",
      });
      this.maybeRefresh();
    }
  }

  /**
   * 开始执行步骤
   */
  start(key: string, detail: string = ""): void {
    this.update(key, StepStatus.RUNNING, detail);
  }

  /**
   * 完成步骤
   */
  complete(key: string, detail: string = ""): void {
    this.update(key, StepStatus.DONE, detail);
  }

  /**
   * 步骤执行失败
   */
  error(key: string, detail: string = ""): void {
    this.update(key, StepStatus.ERROR, detail);
  }

  /**
   * 跳过步骤
   */
  skip(key: string, detail: string = ""): void {
    this.update(key, StepStatus.SKIPPED, detail);
  }

  /**
   * 更新步骤状态
   */
  private update(key: string, status: StepStatus, detail: string): void {
    const step = this.steps.find((s) => s.key === key);
    if (step) {
      step.status = status;
      if (detail) {
        step.detail = detail;
      }
      this.maybeRefresh();
      return;
    }

    // 如果步骤不存在，则添加它
    this.steps.push({
      key,
      label: key,
      status,
      detail,
    });
    this.maybeRefresh();
  }

  /**
   * 触发刷新回调（如果存在）
   */
  private maybeRefresh(): void {
    if (this.refreshCallback) {
      try {
        this.refreshCallback();
      } catch (error) {
        // 静默处理刷新回调错误
      }
    }
  }

  /**
   * 获取状态对应的符号和颜色
   */
  private getStatusSymbol(status: StepStatus): {
    symbol: string;
    color: string;
  } {
    switch (status) {
      case StepStatus.DONE:
        return { symbol: "●", color: "\x1b[32m" }; // 绿色实心圆
      case StepStatus.PENDING:
        return { symbol: "○", color: "\x1b[90m" }; // 灰色空心圆
      case StepStatus.RUNNING:
        return { symbol: "○", color: "\x1b[36m" }; // 青色空心圆
      case StepStatus.ERROR:
        return { symbol: "●", color: "\x1b[31m" }; // 红色实心圆
      case StepStatus.SKIPPED:
        return { symbol: "○", color: "\x1b[33m" }; // 黄色空心圆
      default:
        return { symbol: " ", color: "" };
    }
  }

  /**
   * 渲染步骤树
   */
  render(): string {
    const lines: string[] = [];

    // 添加标题
    lines.push(`\x1b[36m${this.title}\x1b[0m`);

    // 渲染每个步骤
    for (const step of this.steps) {
      const { symbol, color } = this.getStatusSymbol(step.status);
      const detailText = step.detail.trim();

      let line: string;

      if (step.status === StepStatus.PENDING) {
        // 待处理状态：整行浅灰色
        if (detailText) {
          line = `${color}${symbol} ${step.label} (${detailText})\x1b[0m`;
        } else {
          line = `${color}${symbol} ${step.label}\x1b[0m`;
        }
      } else {
        // 其他状态：标签白色，详情浅灰色括号
        if (detailText) {
          line = `${color}${symbol}\x1b[0m \x1b[37m${step.label}\x1b[0m \x1b[90m(${detailText})\x1b[0m`;
        } else {
          line = `${color}${symbol}\x1b[0m \x1b[37m${step.label}\x1b[0m`;
        }
      }

      lines.push(`├── ${line}`);
    }

    // 修复最后一行的树形连接符
    if (lines.length > 1) {
      const lastIndex = lines.length - 1;
      lines[lastIndex] = lines[lastIndex].replace("├──", "└──");
    }

    return lines.join("\n");
  }

  /**
   * 显示步骤树
   */
  display(): void {
    console.log("\n" + this.render() + "\n");
  }

  /**
   * 获取所有步骤
   */
  getAllSteps(): Step[] {
    return [...this.steps];
  }

  /**
   * 获取步骤统计信息
   */
  getStatistics(): {
    total: number;
    pending: number;
    running: number;
    done: number;
    error: number;
    skipped: number;
  } {
    const stats = {
      total: this.steps.length,
      pending: 0,
      running: 0,
      done: 0,
      error: 0,
      skipped: 0,
    };

    for (const step of this.steps) {
      stats[step.status]++;
    }

    return stats;
  }

  /**
   * 清空所有步骤
   */
  clear(): void {
    this.steps = [];
    this.maybeRefresh();
  }

  /**
   * 检查是否所有步骤都已完成
   */
  isAllCompleted(): boolean {
    return this.steps.every(
      (step) =>
        step.status !== StepStatus.PENDING && step.status !== StepStatus.RUNNING
    );
  }

  /**
   * 检查是否有步骤执行失败
   */
  hasErrors(): boolean {
    return this.steps.some((step) => step.status === StepStatus.ERROR);
  }

  /**
   * 获取标题
   */
  getTitle(): string {
    return this.title;
  }

  /**
   * 设置标题
   */
  setTitle(title: string): void {
    this.title = title;
    this.maybeRefresh();
  }
}
