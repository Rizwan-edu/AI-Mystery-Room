import { execSync } from 'child_process';
import os from 'os';

const port = process.argv[3] || process.env.PORT || 5000;
const action = process.argv[2] || 'check'; // 'check' or 'kill'

function getPidsOnPort(targetPort) {
  const isWindows = os.platform() === 'win32';
  const pids = new Set();

  try {
    if (isWindows) {
      const output = execSync(`netstat -ano -p tcp | findstr ":${targetPort}"`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });

      const lines = output.trim().split('\n');
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        // Format: TCP [address]:port [foreign_addr]:* [STATE] [PID]
        if (parts.length >= 5) {
          const state = parts[3];
          const pid = parseInt(parts[parts.length - 1], 10);
          if (pid && !isNaN(pid) && (state === 'LISTENING' || state === 'FIN_WAIT_1' || state === 'CLOSED')) {
            pids.add(pid);
          }
        }
      }
    } else {
      const output = execSync(`lsof -ti :${targetPort}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      output.trim().split('\n').forEach((pidStr) => {
        const pid = parseInt(pidStr.trim(), 10);
        if (pid) pids.add(pid);
      });
    }
  } catch (err) {
    // Command returns exit code 1 if no matches found
  }

  return Array.from(pids);
}

const currentPids = getPidsOnPort(port);

if (action === 'check') {
  if (currentPids.length === 0) {
    console.log(`✅ Port ${port} is free and available.`);
  } else {
    console.log(`⚠️ Port ${port} is currently in use by PID(s): ${currentPids.join(', ')}`);
  }
} else if (action === 'kill') {
  if (currentPids.length === 0) {
    console.log(`✅ Port ${port} is already free. No process to terminate.`);
  } else {
    console.log(`🛑 Terminating process(es) holding port ${port}: ${currentPids.join(', ')}...`);
    for (const pid of currentPids) {
      // Don't kill current node process
      if (pid === process.pid) continue;
      try {
        if (os.platform() === 'win32') {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        } else {
          execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
        }
        console.log(`  ✓ Terminated PID ${pid}`);
      } catch (e) {
        console.warn(`  ⚠️ Could not terminate PID ${pid}: ${e.message}`);
      }
    }
    console.log(`✅ Port ${port} has been cleared.`);
  }
}
