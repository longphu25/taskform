/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/taskform::sponsor';
export const SponsorVault = new MoveStruct({ name: `${$moduleName}::SponsorVault`, fields: {
        id: bcs.Address,
        form_id: bcs.Address,
        owner: bcs.Address,
        budget_remaining: bcs.u64(),
        max_submissions: bcs.u64(),
        used_submissions: bcs.u64()
    } });
export interface FormIdArguments {
    vault: RawTransactionArgument<string>;
}
export interface FormIdOptions {
    package?: string;
    arguments: FormIdArguments | [
        vault: RawTransactionArgument<string>
    ];
}
export function formId(options: FormIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/taskform';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sponsor',
        function: 'form_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface BudgetRemainingArguments {
    vault: RawTransactionArgument<string>;
}
export interface BudgetRemainingOptions {
    package?: string;
    arguments: BudgetRemainingArguments | [
        vault: RawTransactionArgument<string>
    ];
}
export function budgetRemaining(options: BudgetRemainingOptions) {
    const packageAddress = options.package ?? '@local-pkg/taskform';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sponsor',
        function: 'budget_remaining',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MaxSubmissionsArguments {
    vault: RawTransactionArgument<string>;
}
export interface MaxSubmissionsOptions {
    package?: string;
    arguments: MaxSubmissionsArguments | [
        vault: RawTransactionArgument<string>
    ];
}
export function maxSubmissions(options: MaxSubmissionsOptions) {
    const packageAddress = options.package ?? '@local-pkg/taskform';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sponsor',
        function: 'max_submissions',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UsedSubmissionsArguments {
    vault: RawTransactionArgument<string>;
}
export interface UsedSubmissionsOptions {
    package?: string;
    arguments: UsedSubmissionsArguments | [
        vault: RawTransactionArgument<string>
    ];
}
export function usedSubmissions(options: UsedSubmissionsOptions) {
    const packageAddress = options.package ?? '@local-pkg/taskform';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sponsor',
        function: 'used_submissions',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CanSponsorArguments {
    vault: RawTransactionArgument<string>;
}
export interface CanSponsorOptions {
    package?: string;
    arguments: CanSponsorArguments | [
        vault: RawTransactionArgument<string>
    ];
}
export function canSponsor(options: CanSponsorOptions) {
    const packageAddress = options.package ?? '@local-pkg/taskform';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["vault"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'sponsor',
        function: 'can_sponsor',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}