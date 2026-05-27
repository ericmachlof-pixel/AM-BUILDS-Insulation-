const express = require('express');
const router  = express.Router();
const { exec } = require('child_process');
const path    = require('path');

const ROOT = path.join(__dirname, '..');

router.post('/', (req, res) => {
  const secret = process.env.DEPLOY_SECRET;

  // Reject if no secret configured
  if (!secret) {
    return res.status(403).send('Deploy not configured');
  }

  // Verify token passed as query param
  const token = req.query.token;
  if (token !== secret) {
    return res.status(401).send('Unauthorized');
  }

  // Respond immediately before pulling
  res.status(200).send('Deploy triggered');

  // Pull latest code from GitHub
  exec('git pull origin main', { cwd: ROOT }, (err, stdout, stderr) => {
    if (err) {
      console.error('[Deploy] git pull failed:', stderr || err.message);
      return;
    }
    console.log('[Deploy] Pulled successfully:', stdout.trim());

    // Exit cleanly — Hostinger process manager auto-restarts with new code
    setTimeout(() => {
      console.log('[Deploy] Restarting app...');
      process.exit(0);
    }, 500);
  });
});

module.exports = router;
