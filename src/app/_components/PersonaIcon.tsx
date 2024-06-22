import { type Persona } from "@prisma/client";
import { PersonIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export const PersonaIcon = ({
  personaId,
  personas,
  coachVariant,
}: {
  personaId: string;
  personas: Persona[];
  coachVariant?: string;
}) => {
  if (!personaId && coachVariant)
    return (
      <div className="flex items-center gap-2 opacity-70">
        <PersonIcon className="h-8 w-8" />
        <p className="italic">sky {coachVariant}</p>
      </div>
    );
  const persona = personas.find((persona) => persona.id === personaId);

  return (
    <div className="flex items-center gap-2">
      {persona?.image ? (
        <Image
          alt={persona.name}
          src={persona.image}
          width="32"
          height="32"
          className="rounded-full"
        />
      ) : (
        <PersonIcon className="h-8 w-8" />
      )}
      <p>{persona?.name}</p>
    </div>
  );
};
