"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

type Portfolio = {
  id: string | number;
  name: string;
};

interface PortfolioComboboxProps {
  portfolios: Portfolio[];
  selectedId: string | number;
  onChange: (id: string | number) => void;
}

export function PortfolioCombobox({
  portfolios,
  selectedId,
  onChange,
}: PortfolioComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = portfolios.find((p) => p.id === selectedId);
  const { language } = useLanguage();
  const t = content[language]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selected ? selected.name : "Portföy seç"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Portföy ara..." />
          <CommandEmpty>{t.noPortfolio}.</CommandEmpty>
          <CommandGroup>
            {portfolios.map((portfolio) => (
              <CommandItem
                key={portfolio.id}
                value={portfolio.id.toString()}
                onSelect={() => {
                  onChange(portfolio.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedId === portfolio.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {portfolio.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
