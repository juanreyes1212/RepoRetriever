import { GitHubAPI } from './github-api';

export type LogCallback = (level: 'info' | 'success' | 'warning' | 'error', message: string, details?: any) => void;

export interface AutomationResult {
  success: boolean;
  repositoryUrl?: string;
  issueUrl?: string;
  pullRequestUrls?: string[];
  durationSeconds: number;
  error?: string;
}

export class AchievementAutomator {
  private api: GitHubAPI;
  private username: string;
  private logCallback?: LogCallback;

  constructor(token: string, username: string, logCallback?: LogCallback) {
    this.api = new GitHubAPI(token);
    this.username = username;
    this.logCallback = logCallback;
  }

  private log(level: 'info' | 'success' | 'warning' | 'error', message: string, details?: any) {
    if (this.logCallback) {
      this.logCallback(level, message, details);
    }
  }

  private generateRepoName(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}`;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async automateYOLO(shouldDeleteRepo: boolean = false): Promise<AutomationResult> {
    const startTime = Date.now();
    let repoName = '';

    try {
      this.log('info', 'Starting YOLO achievement automation...');

      repoName = this.generateRepoName('yolo-achievement');
      this.log('info', `Creating repository: ${repoName}`);

      const repo = await this.api.createRepository(
        repoName,
        'Repository for YOLO achievement - merging without review'
      );
      this.log('success', `Repository created: ${repo.html_url}`);

      await this.delay(1000);

      this.log('info', 'Making first direct commit to main branch...');
      const readmeContent = await this.api.getFileContent(this.username, repoName, 'README.md');

      await this.api.updateFile(
        this.username,
        repoName,
        'README.md',
        `# YOLO Achievement\n\nThis repository demonstrates merging directly to main without a pull request!\n\nFirst commit: ${new Date().toISOString()}`,
        'First YOLO commit - direct to main',
        readmeContent.sha
      );
      this.log('success', 'First commit completed');

      await this.delay(1000);

      this.log('info', 'Making second direct commit to main branch...');
      const updatedReadme = await this.api.getFileContent(this.username, repoName, 'README.md');

      await this.api.updateFile(
        this.username,
        repoName,
        'README.md',
        `# YOLO Achievement\n\nThis repository demonstrates merging directly to main without a pull request!\n\nFirst commit: ${new Date().toISOString()}\n\nSecond commit: ${new Date().toISOString()}\n\n## Achievement Unlocked!\n\nYOLO - Merged changes without a pull request review.`,
        'Second YOLO commit - direct to main',
        updatedReadme.sha
      );
      this.log('success', 'Second commit completed');

      this.log('success', 'YOLO achievement completed! Two commits merged directly to main.');

      if (shouldDeleteRepo) {
        await this.delay(2000);
        this.log('info', `Deleting repository: ${repoName}`);
        await this.api.deleteRepository(this.username, repoName);
        this.log('success', 'Repository deleted successfully');
      }

      const duration = Math.floor((Date.now() - startTime) / 1000);

      return {
        success: true,
        repositoryUrl: repo.html_url,
        durationSeconds: duration,
      };
    } catch (error) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `YOLO automation failed: ${errorMessage}`);

      return {
        success: false,
        durationSeconds: duration,
        error: errorMessage,
      };
    }
  }

  async automateQuickdraw(shouldDeleteRepo: boolean = false): Promise<AutomationResult> {
    const startTime = Date.now();
    let repoName = '';

    try {
      this.log('info', 'Starting Quickdraw achievement automation...');

      repoName = this.generateRepoName('quickdraw-achievement');
      this.log('info', `Creating repository: ${repoName}`);

      const repo = await this.api.createRepository(
        repoName,
        'Repository for Quickdraw achievement - close issue within 5 minutes'
      );
      this.log('success', `Repository created: ${repo.html_url}`);

      await this.delay(1000);

      this.log('info', 'Creating issue...');
      const issueStartTime = Date.now();

      const issue = await this.api.createIssue(
        this.username,
        repoName,
        'Quickdraw Test Issue',
        `This issue will be closed immediately to earn the Quickdraw achievement.\n\nCreated at: ${new Date().toISOString()}`
      );
      this.log('success', `Issue created: ${issue.html_url}`);

      await this.delay(500);

      this.log('info', 'Closing issue...');
      await this.api.closeIssue(this.username, repoName, issue.number);

      const issueCloseTime = Math.floor((Date.now() - issueStartTime) / 1000);
      this.log('success', `Issue closed in ${issueCloseTime} seconds`);

      if (issueCloseTime < 300) {
        this.log('success', 'Quickdraw achievement completed! Issue closed within 5 minutes.');
      } else {
        this.log('warning', 'Issue closed but may have exceeded 5-minute window.');
      }

      if (shouldDeleteRepo) {
        await this.delay(2000);
        this.log('info', `Deleting repository: ${repoName}`);
        await this.api.deleteRepository(this.username, repoName);
        this.log('success', 'Repository deleted successfully');
      }

      const duration = Math.floor((Date.now() - startTime) / 1000);

      return {
        success: true,
        repositoryUrl: repo.html_url,
        issueUrl: issue.html_url,
        durationSeconds: duration,
      };
    } catch (error) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `Quickdraw automation failed: ${errorMessage}`);

      return {
        success: false,
        durationSeconds: duration,
        error: errorMessage,
      };
    }
  }

  async automatePullShark(shouldDeleteRepo: boolean = false): Promise<AutomationResult> {
    const startTime = Date.now();
    let repoName = '';
    const pullRequestUrls: string[] = [];

    try {
      this.log('info', 'Starting Pull Shark achievement automation...');
      this.log('info', 'This will create and merge 2 pull requests...');

      repoName = this.generateRepoName('pull-shark-achievement');
      this.log('info', `Creating repository: ${repoName}`);

      const repo = await this.api.createRepository(
        repoName,
        'Repository for Pull Shark achievement - 2 merged pull requests'
      );
      this.log('success', `Repository created: ${repo.html_url}`);

      for (let i = 1; i <= 2; i++) {
        this.log('info', `Starting pull request ${i} of 2...`);

        await this.delay(1000);

        const branchName = `feature/pr-${i}-${Date.now()}`;
        this.log('info', `Creating branch: ${branchName}`);

        await this.api.createBranch(this.username, repoName, branchName, repo.default_branch);
        this.log('success', `Branch created: ${branchName}`);

        await this.delay(1000);

        this.log('info', 'Adding changes to branch...');
        const fileName = `feature-${i}.md`;
        await this.api.updateFile(
          this.username,
          repoName,
          fileName,
          `# Feature ${i}\n\nThis is feature ${i} for the Pull Shark achievement.\n\nCreated at: ${new Date().toISOString()}`,
          `Add feature ${i}`,
          undefined,
          branchName
        );
        this.log('success', `File ${fileName} committed to ${branchName}`);

        await this.delay(1000);

        this.log('info', `Creating pull request ${i}...`);
        const pr = await this.api.createPullRequest(
          this.username,
          repoName,
          `Feature ${i} - Pull Shark Achievement`,
          branchName,
          repo.default_branch,
          `This is pull request ${i} for the Pull Shark achievement.\n\nAdds feature ${i} functionality.`
        );
        this.log('success', `Pull request created: ${pr.html_url}`);
        pullRequestUrls.push(pr.html_url);

        await this.delay(2000);

        this.log('info', `Merging pull request ${i}...`);
        await this.api.mergePullRequest(this.username, repoName, pr.number, `Merge PR ${i}`);
        this.log('success', `Pull request ${i} merged successfully`);

        await this.delay(1000);
      }

      this.log('success', 'Pull Shark achievement completed! 2 pull requests created and merged.');

      if (shouldDeleteRepo) {
        await this.delay(2000);
        this.log('info', `Deleting repository: ${repoName}`);
        await this.api.deleteRepository(this.username, repoName);
        this.log('success', 'Repository deleted successfully');
      }

      const duration = Math.floor((Date.now() - startTime) / 1000);

      return {
        success: true,
        repositoryUrl: repo.html_url,
        pullRequestUrls,
        durationSeconds: duration,
      };
    } catch (error) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', `Pull Shark automation failed: ${errorMessage}`);

      return {
        success: false,
        repositoryUrl: pullRequestUrls.length > 0 ? `https://github.com/${this.username}/${repoName}` : undefined,
        pullRequestUrls: pullRequestUrls.length > 0 ? pullRequestUrls : undefined,
        durationSeconds: duration,
        error: errorMessage,
      };
    }
  }
}
