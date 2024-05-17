import { ChevronDownLine, MagnifierLine } from "@mochi-ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
  TextFieldRoot,
  TextFieldInput,
  TextFieldDecorator,
  List,
  Checkbox,
} from "@mochi-ui/core";
import { useState } from "react";
import clsx from "clsx";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useTransactions } from "@/store/transactions";
import { TxBadge } from "../tx-badge";

export const TRANSACTION_ACTIONS = [
  // { id: "stake", idSearch: "stake", value: "Stake" },
  // { id: "unstake", idSearch: "unstake", value: "Unstake" },
  { id: "transfer", idSearch: "transfer tip", value: "Transfer" },
  { id: "airdrop", idSearch: "airdrop", value: "Airdrop" },
  { id: "vault_transfer", idSearch: "vault", value: "Vault Transfer" },
];

export const TxHeaderAction = () => {
  const { filters, setFilters } = useTransactions();
  const [query, setQuery] = useState("");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex gap-x-1 justify-between items-center focus:outline-none"
        >
          <span>ACTION</span>
          <ChevronDownLine className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="!p-3 bg-background-popup">
          <div className="flex flex-col">
            <Combobox
              multiple
              value={filters.actions}
              onChange={(values) => {
                setFilters({ actions: values });
              }}
            >
              <TextFieldRoot>
                <TextFieldDecorator>
                  <MagnifierLine />
                </TextFieldDecorator>
                <ComboboxInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search action"
                  as={TextFieldInput}
                />
              </TextFieldRoot>
              <ComboboxOptions static className="-mx-1 mt-2">
                <List
                  data={TRANSACTION_ACTIONS.filter((a) =>
                    a.idSearch.toLowerCase().includes(query.toLowerCase())
                  )}
                  renderItem={(a) => {
                    return (
                      <ComboboxOption
                        key={a.id}
                        value={a.id}
                        className="focus:outline-none"
                      >
                        {({ selected, active }) => {
                          return (
                            <div
                              className={clsx(
                                "rounded flex gap-x-2 items-center py-1 px-2",
                                {
                                  "cursor-pointer bg-background-level2": active,
                                }
                              )}
                            >
                              <Checkbox checked={selected} />
                              <TxBadge action={a.id as any} />
                            </div>
                          );
                        }}
                      </ComboboxOption>
                    );
                  }}
                />
              </ComboboxOptions>
            </Combobox>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};
