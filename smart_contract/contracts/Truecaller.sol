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

    mapping(string => Caller) public callers;
    string[] public spamMobileNumbers;
    Caller[] public callerArray;

    event CallerRegistered(
        string indexed mobileNumberHash,
        string name,
        string email
    );
    event SpamReported(
        string indexed mobileNumberHash,
        uint256 spamCount,
        bool isSpam
    );
    event SpamReportCleared(string indexed mobileNumberHash);

    uint256 public constant spamCooldown = 1 minutes;

    mapping(string => bool) private registeredMobileNumbers;
    mapping(string => bool) private registeredEmails;

    // function hashMobileNumber(string memory mobileNumber) internal pure returns (string) {
    //     return keccak256(abi.encodePacked(mobileNumber));
    // }

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

        // string mobileNumberHash = hashMobileNumber(mobileNumber);

        callers[mobileNumber] = newCaller;
        callerArray.push(newCaller);

        emit CallerRegistered(mobileNumber, name, email);
    }

    function getAllCallerInfo() public view returns (Caller[] memory) {
        return callerArray;
    }

    function getAllSpamNumbers()
        public
        view
        returns (
            string[] memory,
            string[] memory,
            string[] memory,
            bool[] memory,
            uint256[] memory
        )
    {
        string[] memory mobileNumbers = new string[](spamMobileNumbers.length);
        string[] memory names = new string[](spamMobileNumbers.length);
        string[] memory emails = new string[](spamMobileNumbers.length);
        bool[] memory isSpamStatus = new bool[](spamMobileNumbers.length);
        uint256[] memory spamCounts = new uint256[](spamMobileNumbers.length);

        //

        for (uint i = 0; i < spamMobileNumbers.length; i++) {
            string memory mobileNumberHash = spamMobileNumbers[i];
            Caller storage caller = callers[mobileNumberHash];

            mobileNumbers[i] = caller.mobileNumber;
            names[i] = caller.name;
            emails[i] = caller.email;
            isSpamStatus[i] = caller.isSpam;
            spamCounts[i] = caller.spamCount;
        }

        return (mobileNumbers, names, emails, isSpamStatus, spamCounts);
    }

     function reportSpam(string memory mobileNumber) public returns (Caller[] memory) {
        string memory mobileNumberHash = mobileNumber;

        if (callers[mobileNumberHash].isSpam) {
            callers[mobileNumberHash].spamCount++;
        } else {
            callers[mobileNumberHash].isSpam = true;
            callers[mobileNumberHash].spamCount = 1;
            spamMobileNumbers.push(mobileNumberHash);
        }

        callers[mobileNumberHash].lastReportTime = block.timestamp;

        // Update the isSpam and spamCount in the callerArray
        for (uint i = 0; i < callerArray.length; i++) {
            if (keccak256(abi.encodePacked(callerArray[i].mobileNumber)) == keccak256(abi.encodePacked(mobileNumberHash))) {
                callerArray[i].isSpam = true;
                callerArray[i].spamCount = 1;
                break;
            }
        }

        return callerArray;
    }
    function testSpamReturn() public view returns (Caller[] memory){
        return callerArray;
    }
    function returnSpamNumbersWithInfo()
        public
        view
        returns (
            string[] memory,
            string[] memory,
            string[] memory,
            uint256[] memory
        )
    {
        uint256 spamCount = spamMobileNumbers.length;
        string[] memory mobileNumbers = new string[](spamCount);
        string[] memory names = new string[](spamCount);
        string[] memory emails = new string[](spamCount);
        uint256[] memory spamCounts = new uint256[](spamCount);

        for (uint256 i = 0; i < spamCount; i++) {
            string storage mobileNumberHash = spamMobileNumbers[i];
            Caller storage caller = callers[mobileNumberHash];

            mobileNumbers[i] = caller.mobileNumber;
            names[i] = caller.name;
            emails[i] = caller.email;
            spamCounts[i] = caller.spamCount;
        }

        return (mobileNumbers, names, emails, spamCounts);
    }

    function clearSpamReport(string memory mobileNumber) public {
        string memory mobileNumberHash = mobileNumber;
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

        // Update the isSpam and spamCount in the callerArray
        for (uint i = 0; i < callerArray.length; i++) {
            if (
                keccak256(abi.encodePacked(callerArray[i].mobileNumber)) ==
                keccak256(abi.encodePacked(mobileNumberHash))
            ) {
                callerArray[i].isSpam = false;
                callerArray[i].spamCount = 0;
                break;
            }
        }

        // emit SpamReportCleared(mobileNumberHash);
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
// 0x8022BD25dC081d6b23aF1a405380D6ED7243CCf5