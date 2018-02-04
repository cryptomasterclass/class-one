## Setup an Ethereum Developer Desktop (Ubuntu) in 14 Easy Steps
Starting with a fresh install of *Ubuntu (16.04 LTS)*, we can setup an Ethereum developer client by following these 13 steps in succession:

### 1. Update the operating system (optional)
It's best that we first update our operating system to make sure we have the latest packages that come pre-installed with Ubuntu. To do this we first update the local packages and then upgrade those packages to their latest versions. To do this, open the Ubuntu terminal program and simply enter the following command:
```bash
sudo apt-get -y update && sudo apt-get -y upgrade
```
### 2. Install an Internet browser
Ethereum Dapps are, loosely speaking, web applications that use the Ethereum network for a backend. So like any other web applications, they require a frontend browser to allow HTTP interaction with users. Google's Chrome browser is good choice since it offers flexibility with Ethereum wallet applications like MetaMask. In Ubuntu we choose the Chromium browser which an open-source version of Chrome. You can install Chromium by entering the following command at the prompt:
```bash
sudo apt-get -y install chromium-browser
```

### 3. Install MetaMask
Go to www.metamask.io and follow the instructions to install the chrome extension.

### 4. Get an IDE (text editor)
We will be developing our Dapps using a combination of programming languages such as *JavaScript* and *Solidity*. Using an efficient integrated development environment (IDE) is crucial to our coding success. *Atom text editor* is a great choice and can be installed by first downloading the repository and then installing the source code via the following commands:
```bash
sudo add-apt-repository -y ppa:webupd8team/atom
sudo apt-get update && sudo apt-get -y install atom
```
### 5. Install a better terminal
While the built-in terminal program in Ubuntu suffices for most tasks, it is beneficial to use a more powerful terminal for advanced tasks. *Terminator* is a great terminal program that allows for split-screen terminals which is very handy in Ethereum development. It can be installed by first downloading the repository and then installing the source code via the following commands:
```base
sudo add-apt-repository -y ppa:gnome-terminator
sudo apt-get update && sudo apt-get -y install terminator
```
### 6. Curl and wget are your friends
*Curl* and *wget* will allow us to download new programs via the terminal and can be installed with the following command:
```bash
sudo apt-get -y install curl wget
```
### 7. Get Git
*Git* is a free and open source distributed version control system and can be installed via its repository:
```bash
sudo apt-add-repository -y ppa:git-core/ppa
sudo apt-get update && sudo apt-get -y install git
```
### 8. We need a better bash
The default shell for Ubuntu is bash. We will update to *zsh* to allow for better integration with git. Additionally, *oh-my-zsh* will improve the zsh shell even further. We install both using the following commands:
```bash
sudo apt-get -y install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```
As a final step you will need to copy+paste the *EXPORT* command you see in terminal window after installing oh-my-zsh into the .zshrc file that is located in your HOME directory. It might be a good time to use the Atom text editor for this task!

### 9. Essential compilers are needed
It's a good idea to install some basic compliers (*gcc/g++*) and common libraries at this point :
```bash
sudo apt-get -y install build-essential libssl-dev
sudo apt-get -y install software-properties-common
```
### 10. Install JS tools
We will be coding our Dapps using primarily *JavaScript*. Installing *Node.js* (aka node) will give us access to a rich library of useful *JavaScript* modules. Installing the node packet manager (npm) will help use Node.js effectively. We can install Node.js using the following commands where the last command makes sure we are using the latest version of Node.js.
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
nvm install node
nvm use node
```
### 11. It's finally time to install Ethereum
We are now ready to install the source code needed to run an Ethereum node. Fortunately, the Ethereum team has provided the community with a personal package archive (ppa) which we will now download and install:
```bash
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo add-apt-repository -y ppa:ethereum/ethereum-dev
sudo apt-get -y update && sudo apt-get -y install ethereum
```
### 12. Truffle will make life easier
Working directly with the Ethereum source code can be difficult. *Truffle* provides a simple solution. As stated in the Truffle github page: "Truffle is a development environment, testing framework and asset pipeline for Ethereum, aiming to make life as an Ethereum developer easier". We install Truffle using the following command:
```bash
npm install -g truffle
```
### 13. Fast node simulation with testrpc
To test (or deploy) any Ethereum Dapp we require an Ethereum node at the client side. There are a few options to setup an Ethereum test node at the client and one of the simplest is called *ethereumjs-testrpc* (or *testrpc* for short). Testrpc is written in *JavaScript* (Node.js) and allows for a fast emulation of an Ethereum blockchain at the client. We can install testrpc using the following command:
```bash
npm install -g ethereumjs-testrpc
```
### 14. Time to clean up (optional)
As a final step we will do one last operating system update to make sure all our packages are up-to-date and finally we will clean out our file system and exit the terminal:
```bash
sudo apt-get -y update && sudo apt-get upgrade
sudo apt-get -y autoremove && sudo apt-get -y autoclean
```
*That's it!* At this point you should be able to run an Ethereum node at the terminal using the command: `testrpc` which will start a node with 10 accounts on your machine. Try `testrpc --help` to learn more about how to customize the testrpc program.
