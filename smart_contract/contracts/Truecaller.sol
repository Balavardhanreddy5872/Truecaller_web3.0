// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Truecaller {
    struct Caller {
        string mobileNumber;
        string name;
        string email;
        uint256 spamCount;
        bool isSpam;
        uint256 lastReportTime;
    }

    mapping(bytes32 => Caller) public callers;
    bytes32[] public spamMobileNumbers;
    Caller[] public callerArray;

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
        Caller memory newCaller = Caller({
            mobileNumber: mobileNumber,
            name: name,
            email: email,
            spamCount: 0,
            isSpam: false,
            lastReportTime: 0
        });

        bytes32 mobileNumberHash = hashMobileNumber(mobileNumber);

        callers[mobileNumberHash] = newCaller;
        callerArray.push(newCaller);

        emit CallerRegistered(mobileNumberHash, name, email);
    }

    function getAllCallerInfo() public view returns (Caller[] memory) {
        return callerArray;
    }

    function getAllSpamNumbers()
        public
        view
        returns (
            bytes32[] memory,
            string[] memory,
            string[] memory,
            bool[] memory,
            uint256[] memory
        )
    {
        bytes32[] memory mobileNumbers = new bytes32[](
            spamMobileNumbers.length
        );
        string[] memory names = new string[](spamMobileNumbers.length);
        string[] memory emails = new string[](spamMobileNumbers.length);
        bool[] memory isSpamStatus = new bool[](spamMobileNumbers.length);
        uint256[] memory spamCounts = new uint256[](spamMobileNumbers.length);

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
