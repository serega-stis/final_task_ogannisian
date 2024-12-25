// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidatesCount;
    string public electionName;
    bool public electionEnded;

    event CandidateAdded(uint id, string name);
    event Voted(uint candidateId);

    constructor() {
        electionName = 'Election';
        electionEnded = false;
    }

    function addCandidate(string memory _name) public {
        require(!electionEnded, "Election has already ended.");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit Voted(_candidateId);
    }

    function endElection() public {
        electionEnded = true;
    }

    function getResults() public view returns (uint winningCandidateId) {
        require(electionEnded, "Election is still ongoing.");
        
        uint winningVoteCount = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }
    }

    function getCandidate(uint _candidateId) public view returns (string memory name, uint voteCount) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
