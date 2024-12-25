"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { abi } from "../../hardhat/artifacts/contracts/YourContract.sol/Voting.json"; // Импортируйте ABI вашего контракта
import './page.css';

const VotingApp = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [candidateName, setCandidateName] = useState('');
    const [candidateId, setCandidateId] = useState('');
    const [results, setResults] = useState('');
    const [electionName, setElectionName] = useState('');
    const [electionEnded, setElectionEnded] = useState(false);

    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Замените на адрес вашего контракта

    useEffect(() => {
        const init = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            console.log(contract)

            setProvider(provider);
            setSigner(signer);
            setContract(contract);

            const name = await contract.electionName();
            setElectionName(name);
            const ended = await contract.electionEnded();
            setElectionEnded(ended);

            await loadCandidates(contract);
        };

        init();
    }, []);

    const loadCandidates = async (contract) => {
        const count = await contract.candidatesCount();
        const candidatesList = [];
        for (let i = 1; i <= count; i++) {
            const candidate = await contract.getCandidate(i);
            candidatesList.push({ id: i, name: candidate[0], voteCount: candidate[1].toNumber() });
        }
        setCandidates(candidatesList);
    };

    const addCandidate = async () => {
        if (!candidateName) return;
        await contract.addCandidate(candidateName);
        alert('Candidate added!');
        setCandidateName('');
        await loadCandidates(contract);
    };

    const vote = async () => {
        if (!candidateId) return;
        await contract.vote(candidateId);
        alert('Vote casted!');
        setCandidateId('');
    };

    const endElection = async () => {
        await contract.endElection();
        alert('Election ended!');
        setElectionEnded(true);
    };

    const getResults = async () => {
        const winningCandidateId = await contract.getResults();
        const winner = await contract.getCandidate(winningCandidateId);
        setResults("Одержал победу: " + winner[0] + ", количество голосов: " + winner[1].toNumber());
    };

    return (
        <div className="main">
            <h2>Выборы</h2>
            <h3>Добавить кандидата</h3>
            <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Имя кандидата"
            />
            <button onClick={addCandidate}>Добавить кандидата</button>

            <h3>Голосование за кандидата</h3>
            <input
                type="number"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                placeholder="Номер кандидата"
            />
            <button onClick={vote}>Отдать голос</button>

            {!electionEnded && (
                <>
                    <h3>End Election</h3>
                    <button onClick={endElection}>End Election</button>
                </>
            )}

            <h3>Кандидаты</h3>
            <ul>
                {candidates.map((candidate) => (
                    <li key={candidate.id}>
                        {candidate.name}: {candidate.voteCount} votes
                    </li>
                ))}
            </ul>

            {electionEnded && (
                <>
                    <h3>Результаты</h3>
                    <button onClick={getResults}>Получить результы</button>
                    <p>{results}</p>
                </>
            )}
        </div>
    );
};

export default VotingApp;
