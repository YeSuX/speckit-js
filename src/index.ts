/**
 * speckit-js - A modern TypeScript/JavaScript toolkit for Spec-Driven Development (SDD)
 * 
 * Build high-quality software faster with executable specifications.
 */

import { promises as fs } from 'fs';
import { join, resolve } from 'path';

export interface SpecKitConfig {
  /** Enable verbose logging */
  verbose?: boolean;
  /** Output directory for generated files */
  outputDir?: string;
}

/**
 * Main SpecKit class for managing spec-driven development workflow
 */
export class SpecKit {
  private config: SpecKitConfig;

  constructor(config: SpecKitConfig = {}) {
    this.config = {
      verbose: false,
      outputDir: './output',
      ...config,
    };
  }

  /**
   * Initialize a new spec-driven development project
   */
  public async init(): Promise<void> {
    if (this.config.verbose) {
      console.log('Initializing SpecKit project...');
    }
    
    try {
      // Create output directory if it doesn't exist
      const outputPath = resolve(this.config.outputDir!);
      await fs.mkdir(outputPath, { recursive: true });
      
      if (this.config.verbose) {
        console.log(`Created output directory: ${outputPath}`);
      }

      // Create initial spec configuration file
      const specConfigPath = join(outputPath, 'speckit.config.json');
      const initialConfig = {
        version: '1.0.0',
        specifications: [],
        testCases: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await fs.writeFile(specConfigPath, JSON.stringify(initialConfig, null, 2));
      
      if (this.config.verbose) {
        console.log(`Created configuration file: ${specConfigPath}`);
      }

      // Create specs directory
      const specsPath = join(outputPath, 'specs');
      await fs.mkdir(specsPath, { recursive: true });
      
      if (this.config.verbose) {
        console.log(`Created specs directory: ${specsPath}`);
      }

      // Create tests directory
      const testsPath = join(outputPath, 'tests');
      await fs.mkdir(testsPath, { recursive: true });
      
      if (this.config.verbose) {
        console.log(`Created tests directory: ${testsPath}`);
      }

      console.log('SpecKit project initialized successfully!');
      console.log(`Output directory: ${outputPath}`);
      console.log(`Configuration file: ${specConfigPath}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to initialize SpecKit project:', errorMessage);
      throw new Error(`Initialization failed: ${errorMessage}`);
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): SpecKitConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<SpecKitConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Check if project is initialized
   */
  public async isInitialized(): Promise<boolean> {
    try {
      const outputPath = resolve(this.config.outputDir!);
      const configPath = join(outputPath, 'speckit.config.json');
      await fs.access(configPath);
      return true;
    } catch {
      return false;
    }
  }
}

// Default export
export default SpecKit;

// Convenience function for quick initialization
export function createSpecKit(config?: SpecKitConfig): SpecKit {
  return new SpecKit(config);
}