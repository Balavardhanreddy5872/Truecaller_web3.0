// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Truecaller {
    struct Caller {
        string mobileNumber;
        string name;
        string email;
        bool isSpam;
        uint256 lastReportTime;
        uint256 spamCount;
    }

    mapping(bytes32 => Caller) public callers;
    bytes32[] public spamMobileNumbers;

    event CallerRegistered(
        bytes32 indexed mobileNumberHash,
        string name,
        string email
    );
    event SpamReported(bytes32 indexed mobileNumberHash, uint256 spamCount);
    event SpamReportCleared(bytes32 indexed mobileNumberHash);

    uint256 public constant spamCooldown = 1 minutes;

    mapping(string => bool) private registeredMobileNumbers;
    mapping(string => bool) private registeredEmails;

    function hashMobileNumber(
        string memory mobileNumber
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(mobileNumber));
    }

    function setCaller(
        string memory mobileNumber,
        string memory name,
        string memory email
    ) public {
        bytes32 mobileNumberHash = hashMobileNumber(mobileNumber);

        // Validation: Ensure the mobile number is a 10-digit Indian number
        require(
            bytes(mobileNumber).length == 10,
            "Mobile number must be 10 digits"
        );
        require(
            isIndianMobileNumber(mobileNumber),
            "Invalid Indian mobile number"
        );

        // Validation: Ensure the email contains the "@" symbol
        require(containsAtSymbol(email), "Invalid email format");

        // Validation: Check that the name has a minimum length of 5 characters
        require(bytes(name).length >= 5, "Name must be at least 5 characters");

        // Check if the mobile number and email are already registered
        require(
            !registeredMobileNumbers[mobileNumber],
            "Mobile number already registered"
        );
        require(!registeredEmails[email], "Email already registered");

        // Mark the mobile number and email as registered
        registeredMobileNumbers[mobileNumber] = true;
        registeredEmails[email] = true;

        // Register the caller
        callers[mobileNumberHash] = Caller(
            mobileNumber,
            name,
            email,
            false,
            0,
            0
        );
        emit CallerRegistered(mobileNumberHash, name, email);
    }

    function getCallerInfo(
        string memory mobileNumber
    )
        public
        view
        returns (string memory, string memory, string memory, bool, uint256)
    {
        bytes32 mobileNumberHash = hashMobileNumber(mobileNumber);
        Caller storage caller = callers[mobileNumberHash];
        return (
            caller.name,
            caller.email,
            caller.mobileNumber,
            caller.isSpam,
            caller.spamCount
        );
    }

    function getAllSpamNumbers()
        public
        view
        returns (
            bytes32[] memory,
            string[] memory,
            string[] memory,
            bool[] memory,
            uint[] memory
        )
    {
        bytes32[] memory mobileNumbers = new bytes32[](
            spamMobileNumbers.length
        );
        string[] memory names = new string[](spamMobileNumbers.length);
        string[] memory emails = new string[](spamMobileNumbers.length);
        bool[] memory isSpamStatus = new bool[](spamMobileNumbers.length);
        uint[] memory spamCounts = new uint[](spamMobileNumbers.length);

        for (uint i = 0; i < spamMobileNumbers.length; i++) {
            bytes32 mobileNumberHash = spamMobileNumbers[i];
            Caller storage caller = callers[mobileNumberHash];

            mobileNumbers[i] = keccak256(abi.encodePacked(caller.mobileNumber));
            names[i] = caller.name;
            emails[i] = caller.email;
            isSpamStatus[i] = caller.isSpam;
            spamCounts[i] = caller.spamCount;
        }

        return (mobileNumbers, names, emails, isSpamStatus, spamCounts);
    }

    function reportSpam(string memory mobileNumber) public {
        bytes32 mobileNumberHash = hashMobileNumber(mobileNumber);
        require(
            bytes(callers[mobileNumberHash].name).length > 0,
            "Caller not found"
        );

        if (callers[mobileNumberHash].isSpam) {
            callers[mobileNumberHash].spamCount++;
        } else {
            callers[mobileNumberHash].isSpam = true;
            callers[mobileNumberHash].spamCount = 1;
            spamMobileNumbers.push(mobileNumberHash);
        }

        callers[mobileNumberHash].lastReportTime = block.timestamp;
        emit SpamReported(
            mobileNumberHash,
            callers[mobileNumberHash].spamCount
        );
    }

    function clearSpamReport(string memory mobileNumber) public {
        bytes32 mobileNumberHash = hashMobileNumber(mobileNumber);
        require(
            callers[mobileNumberHash].isSpam,
            "Caller is not marked as spam"
        );
        require(
            block.timestamp - callers[mobileNumberHash].lastReportTime >=
                spamCooldown,
            "Cooldown period not elapsed"
        );
        callers[mobileNumberHash].spamCount = 0;
        callers[mobileNumberHash].isSpam = false;
        for (uint256 i = 0; i < spamMobileNumbers.length; i++) {
            if (spamMobileNumbers[i] == mobileNumberHash) {
                spamMobileNumbers[i] = spamMobileNumbers[
                    spamMobileNumbers.length - 1
                ];
                spamMobileNumbers.pop();
                break;
            }
        }
        emit SpamReportCleared(mobileNumberHash);
    }

    function isIndianMobileNumber(
        string memory mobileNumber
    ) internal pure returns (bool) {
        bytes memory mobileBytes = bytes(mobileNumber);
        if (mobileBytes.length != 10) {
            return false;
        }
        bytes1 firstChar = mobileBytes[0];
        return (firstChar == "7" || firstChar == "8" || firstChar == "9");
    }

    function containsAtSymbol(
        string memory email
    ) internal pure returns (bool) {
        bytes memory emailBytes = bytes(email);
        for (uint256 i = 0; i < emailBytes.length; i++) {
            if (emailBytes[i] == "@") {
                return true;
            }
        }
        return false;
    }
}
