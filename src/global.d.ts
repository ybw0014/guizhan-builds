
/**
 * 任务选项
 */
interface TaskOptions {
    customDir: string | null;
    target: {
        name: string;
        version: string;
    }
}

/**
 * 任务信息
 */
interface TaskInfo {
    repoStr: string;
    user: string;
    repo: string;
    branch: string;
    directory: string;
    rawDirectory: string;
    options: TaskOptions;
}

declare global {
    var running: boolean;
    var tasks: Array<TaskInfo>;
}

export { };
