// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectionContract {
    
    // Structure pour stocker les détails du candidat
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Structure pour stocker les détails de l'électeur
    struct Elector {
        bool hasVoted;
        uint voteCandidateId;
    }

    // Structure pour stocker les détails d'une élection
    struct Election {
        uint id;
        string name;
        bool isClosed;
        uint[] candidateIds;  // IDs des candidats associés à cette élection
        uint totalVotes;
    }

    // Déclaration d'administrateur
    address public admin;

    // Compteurs pour garder la trace des élections et des candidats
    uint public candidatesCount;
    uint public electionsCount;

    // Mapping pour associer les électeurs à leur vote
    mapping(address => Elector) public electors;

    // Mapping pour gérer les candidats et les élections
    mapping(uint => Candidate) public candidates;
    mapping(uint => Election) public elections;

    // Tableau pour stocker l'audit des votes
    struct VoteRecord {
        address voter;
        uint candidateId;
    }
    VoteRecord[] public voteAuditTrail;

    // Événements pour notifier les actions
    event CandidateAdded(uint indexed id, string name);
    //event CandidateAdded(uint candidateId, string candidateName);
    event ElectionCreated(uint electionId, string electionName);
    event CandidateAssociatedToElection(uint electionId, uint candidateId);
    event VoteCast(address elector, uint candidateId);
    event VotingOpened(uint electionId);
    event VotingClosed(uint electionId);
    event ResultsPublished(uint indexed _electionId, string winnerName, uint winnerVoteCount);
    //event ResultsPublished(uint electionId, string winnerName, uint winnerVoteCount);

    // Modificateurs
    modifier onlyAdmin() {
        require(msg.sender == admin, "Seul l'administrateur peut effectuer cette action.");
        _;
    }

    modifier isElectionOpen(uint _electionId) {
        require(!elections[_electionId].isClosed, "The election is closed.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Ajouter un candidat globalement
    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    // Créer une élection et retourner son ID
    function createElection(string memory _name) public onlyAdmin returns (uint) {
        electionsCount++;
        Election storage newElection = elections[electionsCount];
        newElection.id = electionsCount;
        newElection.name = _name;
        newElection.isClosed = true;  // Par défaut, l'élection est fermée
        emit ElectionCreated(electionsCount, _name);
        return electionsCount;
    }

    // Associer un candidat existant à une élection
    function addCandidateToElection(uint _electionId, uint _candidateId) public onlyAdmin {
        require(elections[_electionId].id != 0, "Election not found.");
        require(candidates[_candidateId].id != 0, "Candidate not found.");
        
        elections[_electionId].candidateIds.push(_candidateId);
        emit CandidateAssociatedToElection(_electionId, _candidateId);
    }

    // Ouvrir les votes pour une élection
    function openVoting(uint _electionId) public onlyAdmin {
        require(elections[_electionId].isClosed == true, "Election already open.");
        elections[_electionId].isClosed = false;
        emit VotingOpened(_electionId);
    }

    // Fermer les votes pour une élection
    function closeVoting(uint _electionId) public onlyAdmin {
        require(elections[_electionId].isClosed == false, "The election is already close.");
        elections[_electionId].isClosed = true;
        emit VotingClosed(_electionId);
    }

    // Voter pour un candidat
    function vote(uint _electionId, uint _candidateId) public isElectionOpen(_electionId) {
        require(!electors[msg.sender].hasVoted, "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        electors[msg.sender] = Elector(true, _candidateId);
        candidates[_candidateId].voteCount++;
        elections[_electionId].totalVotes++;

        voteAuditTrail.push(VoteRecord(msg.sender, _candidateId));

        emit VoteCast(msg.sender, _candidateId);
        emit LogTotalVotes(_electionId, elections[_electionId].totalVotes); // Ajout pour vérifier `totalVotes`
    }

    event LogTotalVotes(uint electionId, uint totalVotes);



    function getElectionResults(uint _electionId) public view returns (
        string memory winnerName,
        uint winnerVoteCount,
        string[] memory candidateNames,
        uint[] memory candidateVotes,
        uint[] memory candidatePercentages,
        uint totalVotes
    ) {
        require(elections[_electionId].id != 0, "Election not found.");
        require(elections[_electionId].isClosed == true, "Election is still ongoing.");

        totalVotes = elections[_electionId].totalVotes;
        uint winningVoteCount = 0;
        bool isTie = false;

        uint numCandidates = elections[_electionId].candidateIds.length;
        candidateNames = new string[](numCandidates);
        candidateVotes = new uint[](numCandidates);
        candidatePercentages = new uint[](numCandidates);

        // Parcours des candidats pour trouver le gagnant et collecter les votes de chaque candidat
        for (uint i = 0; i < numCandidates; i++) {
            uint candidateId = elections[_electionId].candidateIds[i];
            uint votes = candidates[candidateId].voteCount;

            candidateNames[i] = candidates[candidateId].name;
            candidateVotes[i] = votes;

            if (totalVotes > 0) {
                candidatePercentages[i] = (votes * 100) / totalVotes;
            } else {
                candidatePercentages[i] = 0;
            }

            if (votes > winningVoteCount) {
                winningVoteCount = votes;
                winnerName = candidates[candidateId].name;
                isTie = false;
            } else if (votes == winningVoteCount && votes > 0) {
                isTie = true;
            }
        }

        if (isTie) {
            winnerName = "Equality between candidates";
        }
        winnerVoteCount = winningVoteCount;
    }

    // Récupérer l'audit des votes (optionnel)
    function getVoteAuditTrail() public view returns (VoteRecord[] memory) {
        return voteAuditTrail;
    }
}
