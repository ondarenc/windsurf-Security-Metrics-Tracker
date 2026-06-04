const fs = require('fs');
const API_BASE_URL = 'http://localhost:3001/api';

const followupData = [
  {
    level: 'HIGH',
    vulnerability: "Session Cookie Missing 'HttpOnly' Attribute",
    service_ip: 'bwint.org',
    source: 'SecurityScorecard',
    remediation_task: 'Modify Cookies',
    ticket: 'INC-156275',
    status: 'Open'
  },
  {
    level: 'HIGH',
    vulnerability: "Session Cookie Missing 'Secure' Attribute",
    service_ip: 'bwint.org',
    source: 'SecurityScorecard',
    remediation_task: 'Some actions pending',
    ticket: 'INC-156275',
    status: 'Open'
  },
  {
    level: 'HIGH',
    vulnerability: 'SSL/TLS Service Supports Weak Protocol',
    service_ip: 'WPMD',
    source: 'SecurityScorecard',
    remediation_task: 'Disable weak services',
    ticket: 'n/a',
    status: 'Fixed'
  },
  {
    level: 'MEDIUM',
    vulnerability: 'TLS Service Supports Weak Cipher Suite',
    service_ip: 'wpmd',
    source: 'SecurityScorecard',
    remediation_task: 'Disable weak services',
    ticket: 'n/a',
    status: 'Discovered'
  },
  {
    level: 'HIGH',
    vulnerability: "Top 38 parameters – Cross-Site Scripting bwiconnect",
    service_ip: 'bwiconnect/congress',
    source: 'Project Discovery',
    remediation_task: 'Looking for a solution',
    ticket: 'not yet ticket',
    status: 'Discovered'
  },
  {
    level: 'MEDIUM',
    vulnerability: 'OpenSSH Terrapin Attack – Detection',
    service_ip: 'bwiconnect',
    source: 'Project Discovery',
    remediation_task: 'Evaluating impact',
    ticket: 'no ticket yet',
    status: 'Discovered'
  },
  {
    level: 'HIGH',
    vulnerability: 'Exposed Internal PKI Infrastructure',
    service_ip: 'Palantir',
    source: 'Project Discovery',
    remediation_task: 'Remove certification service',
    ticket: 'n/a',
    status: 'Fix in progress'
  },
  {
    level: 'MEDIUM',
    vulnerability: 'Odoo CMS – Open Redirect',
    service_ip: 'Odoo server',
    source: 'Project Discovery',
    remediation_task: 'Server not in internet / expect to power off soon',
    ticket: 'n/a',
    status: 'Accepted risk'
  },
  {
    level: 'HIGH',
    vulnerability: 'Git Configuration - Detect',
    service_ip: 'team.bwint.org',
    source: 'Project Discovery',
    remediation_task: 'Remove information',
    ticket: 'INC-156153',
    status: 'Open'
  },
  {
    level: 'MEDIUM',
    vulnerability: 'Users or devices inactive for at least 90 days',
    service_ip: 'Entra-ID',
    source: 'Purple Knight Entra-ID',
    remediation_task: 'Review list of computers',
    ticket: 'INC-156289',
    status: 'Open'
  },
  {
    level: 'HIGH',
    vulnerability: 'Non-default principals with DC Sync rights on the domain IOE Found',
    service_ip: 'Active Directory',
    source: 'Purple Knight AD',
    remediation_task: 'Ensure that there are no unnecessary replication permissions',
    ticket: 'INC-156293',
    status: 'Open'
  },
  {
    level: 'HIGH',
    vulnerability: 'Weak certificate cipher',
    service_ip: 'Palantir',
    source: 'Purple Knight AD',
    remediation_task: 'certificates need to be revoked and re-issued',
    ticket: 'INC-156293',
    status: 'Fix in progress'
  }
];

async function addFollowupItems() {
  for (const item of followupData) {
    try {
      const response = await fetch(`${API_BASE_URL}/followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        console.log(`✓ Added: ${item.vulnerability}`);
      } else {
        console.error(`✗ Failed: ${item.vulnerability}`);
      }
    } catch (error) {
      console.error(`✗ Error adding ${item.vulnerability}:`, error.message);
    }
  }

  console.log('\nDone!');
}

addFollowupItems();
