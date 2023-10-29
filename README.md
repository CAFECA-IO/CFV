# Carbon Footprint Verification
## Setup Environment
- ubuntu 22.04
- [Setup User](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/linux/create_sudoer_user_in_ubuntu.md)
- [Deploy Node Server](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/deploy/node_server.md)
## Setup GUI
```shell
sudo apt update && sudo apt upgrade
sudo apt install slim
sudo apt install ubuntu-desktop
sudo reboot
```
## Initial Project
prepare folder
```shell
sudo mkdir /workspace
sudo chown -R ${user} /workspace
```
clone project
```shell
git clone https://github.com/CAFECA-IO/CFV
```
install libraries
```shell
cd CFV
npm install
```
initial config files
```shell
vi .env.local
```
initial database
```shell
npx prisma migrate dev --name init
```
