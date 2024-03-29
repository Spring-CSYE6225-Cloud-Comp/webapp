#!/bin/bash
# # Define database variables
# DB_NAME="db1"
# DB_USER="root"
# DB_PASSWORD="root"
# DB_HOST="localhost"
# PORT="8080"


# cd webapp-forked

# # Create the .env file
# cat <<EOF > .env
# DB_NAME='$DB_NAME'  
# DB_USER='$DB_USER'
# DB_PASSWORD='$DB_PASSWORD'
# DB_HOST='$DB_HOST' 
# PORT=$PORT
# EOF

# echo ".env file has been created"

# # Update package lists and upgrade installed packages
# yum update -y

# # Install nodejs and npm
# yum install nodejs npm -y

# # Check if MySQL is installed; if not, install it
# if ! command -v mysql &> /dev/null; then
#   echo "MySQL is not installed. Installing..." 
#   yum install mysql-server -y
#   echo "MySQL has been installed."
# else
#   echo "MySQL is already installed."
# fi

# # Set up MySQL database 
# mysql -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
# echo "MySQL database '$DB_NAME' has been created (if it didn't exist)."

# # Install project dependencies  
# echo "Installing project dependencies..."
# npm install
# npm uninstall mysql2
# npm install mysql2@3.0.0 
# echo "Project dependencies have been installed."

# # Run your Node.js file
# echo "Running your Node.js file..."
# node app.js

# Install mariadb
# sudo yum install -y mariadb mariadb-server
# sudo systemctl start mariadb
# sudo systemctl enable mariadb
# sudo mysql_secure_installation <<EOF

# y
# root
# root
# y
# y
# y
# y
# EOF

# #Launch MYSQL
# sudo mysql -u root -p"root" --execute="SET PASSWORD FOR 'root'@'localhost' = PASSWORD('root');"

# Update package lists and upgrade installed packages
sudo yum update -y
sudo yum upgrade -y

# Install Node.js and npm
# sudo yum remove -y nodejs npm
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# Install unzip
sudo yum install -y unzip

# Remove Git
sudo yum remove git -y

# Set up MySQL database
# mysql -u root -p"root" -e "CREATE DATABASE IF NOT EXISTS db1;"
# echo "MySQL database 'db1' has been created (if it didn't exist)."

# Add group 
sudo groupadd csye6225
sudo useradd -s /usr/sbin/nologin -g csye6225 -d /opt/csye6225 -m csye6225

# Unzip the file to the destination directory
echo "I'm in $(pwd) directory"
dir
sudo mkdir -p /opt/csye6225/Neha_Shende_002783740_05
sudo su
whoami
# Set permissions
sudo chmod -R 757 /opt/csye6225

sudo unzip /tmp/Neha_Shende_002783740_05 -d /opt/csye6225/Neha_Shende_002783740_05/
sleep 5

cd /opt/csye6225/Neha_Shende_002783740_05
echo "Installing project dependencies..."
npm install /opt/csye6225/Neha_Shende_002783740_05/package.json
npm uninstall mysql2
npm install mysql2@3.0.0
echo "Project dependencies have been installed."
# sudo yum install nodejs npm -y
# sudo npm install --unsafe-perm
# echo "Dependencies installed"

# Change ownership 
sudo chown -R csye6225:csye6225 /opt/csye6225/Neha_Shende_002783740_05

# Set permissions
# sudo chmod -R 755 /opt/csye6225/Neha_Shende_002783740_04

# Copy service file
sudo cp /opt/csye6225/Neha_Shende_002783740_05/DBservice.service /etc/systemd/system/

# Enable and start the service
# sudo systemctl enable DBservice
# sudo systemctl start DBservice

# Clean package cache
sudo yum clean all
