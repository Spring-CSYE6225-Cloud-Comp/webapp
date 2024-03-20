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

cat << EOF | sudo tee /etc/google-cloud-ops-agent/config.yaml
logging:
  receivers:
    my-app-receiver:
      type: files
      include_paths:
        - /opt/csye6225/Neha_Shende_002783740_05/var/log/*.log
      record_log_file_path: true
  processors:
    my-app-processor:
      type: parse_json
      time_key: time
      time_format: "%Y-%m-%dT%H:%M:%S.%L%Z"
  service:
    pipelines:
      default_pipeline:
        receivers: [my-app-receiver]
        processors: [my-app-processor]
EOF

sudo systemctl restart google-cloud-ops-agent