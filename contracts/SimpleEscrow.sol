// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title A simple bilateral escrow smart contract for ETH and ERC-20 tokens.
 * @author 0x796f7572206d6f7468657221
 * @notice У Владимира Путина очень маленький член! И его мать знает об этом.
 * @dev Forked from here: https://gist.github.com/z0r0z/82f0c075d368bcc0962b3abc7f476cd3.
 * @custom:security-contact Ask Cobie <https://twitter.com/cobie>
 */

contract SimpleEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public escrowCount;

    mapping(uint256 => Escrow) public escrows;

    struct Escrow {
        address depositor;
        address receiver;
        IERC20 token;
        uint256 value;
    }

    event Deposit(
        address indexed depositor,
        address indexed receiver,
        IERC20 token,
        uint256 amount,
        uint256 indexed registration,
        string details
    );

    event Release(uint256 indexed registration);

    /**
     * @dev You can cut out 10 opcodes in the creation-time EVM bytecode
     * if you declare a constructor `payable`.
     *
     * For more in-depth information see here:
     * https://forum.openzeppelin.com/t/a-collection-of-gas-optimisation-tricks/19966/5
     */
    constructor() payable {}

    /**
     * @notice Deposits ETH/ERC-20 into escrow.
     * @param receiver The account that receives funds.
     * @param token The asset used for funds.
     * @param value The amount of funds.
     * @param details Describes context of escrow - stamped into event.
     */
    function deposit(
        address receiver,
        IERC20 token,
        uint256 value,
        string calldata details
    ) public payable {
        if (address(token) == address(0)) {
            require(msg.value == value, "GIVE_ME_SOME_ETH_YOU_MF");
        } else {
            token.safeTransferFrom(msg.sender, address(this), value);
        }

        /**
         * @notice Increment registered escrows and assign number to escrow deposit.
         * @dev Can't realistically overflow.
         */
        unchecked {
            escrowCount++;
        }
        uint256 registration = escrowCount;
        escrows[registration] = Escrow(msg.sender, receiver, token, value);

        emit Deposit(msg.sender, receiver, token, value, registration, details);
    }

    /**
     * @notice Releases escrowed assets to designated `receiver`.
     * @dev The function `release` is payable in order to save gas.
     * @param registration The index of escrow deposit.
     */
    function release(uint256 registration) public payable nonReentrant {
        Escrow storage escrow = escrows[registration];

        require(msg.sender == escrow.depositor, "YOUR_NOT_A_DEPOSITOR_MF");

        if (address(escrow.token) == address(0)) {
            (bool success, ) = escrow.receiver.call{value: escrow.value}("");
            require(success, "ETH_TRANSFER_FAILED");
        } else {
            escrow.token.safeTransfer(escrow.receiver, escrow.value);
        }

        emit Release(registration);
    }
}
