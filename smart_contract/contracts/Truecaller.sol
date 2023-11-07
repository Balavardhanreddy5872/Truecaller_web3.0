// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Truecaller {
    struct Caller {
        string mobileNumber;
        string name;
        string email;
        bool isSpam;
        uint256 lastReportTime;
    }

    mapping(string => Caller) public callers;
    Caller[] public callerArray;

    event CallerRegistered(
        string indexed mobileNumberHash,
        string name,
        string email
    );
    event SpamReported(
        string indexed mobileNumberHash,
        bool isSpam
    );
    event SpamRemoved(
        string indexed mobileNumberHash
    );

    uint256 public constant spamCooldown = 1 minutes;

    function setCaller(
        string memory mobileNumber,
        string memory name,
        string memory email
    ) public {
        Caller memory newCaller = Caller({
            mobileNumber: mobileNumber,
            name: name,
            email: email,
            isSpam: false,
            lastReportTime: 0
        });

        callers[mobileNumber] = newCaller;
        callerArray.push(newCaller);

        emit CallerRegistered(mobileNumber, name, email);
    }

    function reportSpam(string memory mobileNumber) public {
        string memory mobileNumberHash = mobileNumber;

        if (!callers[mobileNumberHash].isSpam) {
            callers[mobileNumberHash].isSpam = true;
        }

        callers[mobileNumberHash].lastReportTime = block.timestamp;

        emit SpamReported(mobileNumberHash, true);
    }

    function removeSpam(string memory mobileNumber) public {
        string memory mobileNumberHash = mobileNumber;

        require(callers[mobileNumberHash].isSpam, "Caller is not marked as spam");
        callers[mobileNumberHash].isSpam = false;

        emit SpamRemoved(mobileNumberHash);
    }

    function getAllCallerInfo() public view returns (Caller[] memory) {
        return callerArray;
    }
}
