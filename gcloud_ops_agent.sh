#!/bin/bash

# Install Ops Agent
#curl -sSO https://dl.google.com/cloudagents/add-logging-agent-repo.sh
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
# sudo bash add-logging-agent-repo.sh --also-install
# sudo service google-fluentd start
# sudo service google-fluentd status  
# sudo systemctl status google-cloud-ops-agent"*"# Verify the status of the Ops Agent

# Configure Ops Agent for application logs
#!/bin/bash

# cat << EOF | sudo tee /etc/google-cloud-ops-agent/config.yaml

# EOF

# Move config.yaml to the specified path
sudo mv /opt/csye6225/Neha_Shende_002783740_05/config.yaml /etc/google-cloud-ops-agent/config.yaml


sudo systemctl restart google-cloud-ops-agent