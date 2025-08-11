import type { Command } from "../models/Command";

export class ExecutorFacade {
	constructor(private readonly command: Command) {}

	async executeCommand() {
        // run the command using Bun's subprocess capabilities
        if (!this.command || !this.command.task) {
            throw new Error("No command provided");
        }
        const output = await ExecutorFacade.runSubProcess(this.command.task as string);
        console.log(output);
    
	}

	    static async runSubProcess(command: string): Promise<string> {
	try {
		const process = Bun.spawn(["sh", "-c", command], {
			stdout: "pipe",
			stderr: "pipe",
		});

		const output = await new Response(process.stdout).text();
		const errorOutput = await new Response(process.stderr).text();

		if (errorOutput.trim()) {
			console.error(`Error: ${errorOutput}`);
		}

		const exitCode = await process.exited;
		if (exitCode !== 0) {
			throw new Error(`Command failed with exit code ${exitCode}`);
		}

		return output.trim();
	} catch (err) {
		throw new Error(`Failed to run command: ${(err as Error).message}`);
	}
}

}
