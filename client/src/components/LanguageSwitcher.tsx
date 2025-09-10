import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {t('languageSwitcher.button')}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
          {t('languageSwitcher.english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("hi")}>
          {t('languageSwitcher.hindi')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("or")}>
          {t('languageSwitcher.odia')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}