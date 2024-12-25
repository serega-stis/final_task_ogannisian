const { deployments, getNamedAccounts } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const contract = await deploy("Voting", {
        from: deployer,
        log: true, // Логи процесса деплоя
    });

    console.log(`Voting deployed at address: ${contract.address}`);
};

module.exports.tags = ["Voting"];