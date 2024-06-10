import { type Persona } from "@prisma/client";

export default function PersonaFormFields({ persona }: { persona?: Persona }) {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <label className="text-base font-light" htmlFor="name">
        name
        <input
          type="text"
          id="name"
          name="name"
          className=" w-full  rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          required
          placeholder="bob, jill..."
          defaultValue={persona?.name}
        />
      </label>
      <label className="text-base font-light" htmlFor="traits">
        traits
        <input
          type="text"
          id="traits"
          name="traits"
          className=" w-full  rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          required
          placeholder="friendly, loving, creative..."
          defaultValue={persona?.traits}
        />
      </label>
      <label className="text-base font-light" htmlFor="description">
        a short description <span className="opacity-60">(optional)</span>
        <textarea
          id="description"
          name="description"
          className="w-full rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          placeholder="they love to dance and sing.. they've been through a lot, and they've grown a lot."
          defaultValue={persona?.description ?? ""}
        />
      </label>
      <label className="text-base font-light" htmlFor="image">
        image <span className="opacity-60">(optional)</span>
        <input
          type="text"
          id="image"
          name="image"
          className=" w-full  rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          placeholder="https://example.com/image.jpg"
          defaultValue={persona?.image ?? ""}
        />
      </label>
      <label className="text-base font-light" htmlFor="age">
        age <span className="opacity-60">(optional)</span>
        <input
          type="number"
          id="age"
          name="age"
          className=" w-full  rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          placeholder="20"
          defaultValue={persona?.age ?? 20}
        />
      </label>
      <label className="text-base font-light" htmlFor="gender">
        orientation <span className="opacity-60">(optional)</span>
        <input
          type="text"
          id="gender"
          name="gender"
          className=" w-full  rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          placeholder="woman, robot, alien..."
          defaultValue={persona?.gender ?? ""}
        />
      </label>
      <label className="text-base font-light" htmlFor="relationship">
        relationship with you <span className="opacity-60">(optional)</span>
        <input
          type="text"
          id="relationship"
          name="relationship"
          className=" w-full  rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          placeholder="friend, partner, dad, advisor..."
          defaultValue={persona?.relationship ?? ""}
        />
      </label>
      <label className="text-base font-light" htmlFor="occupation">
        occupation <span className="opacity-60">(optional)</span>
        <input
          type="text"
          id="occupation"
          name="occupation"
          className=" w-full  rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          placeholder="student, coach, teacher..."
          defaultValue={persona?.occupation ?? ""}
        />
      </label>
      <label className="text-base font-light" htmlFor="communicationStyle">
        communication style <span className="opacity-60">(optional)</span>
        <input
          type="text"
          id="communicationStyle"
          name="communicationStyle"
          className=" w-full  rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          placeholder="assertive, direct, empathetic..."
          defaultValue={persona?.communicationStyle ?? ""}
        />
      </label>
      <label className="text-base font-light" htmlFor="communicationSample">
        communication sample <span className="opacity-60">(optional)</span>
        <textarea
          id="communicationSample"
          name="communicationSample"
          className=" w-full  rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
          placeholder="If you can walk you can dance, if you can talk you can sing."
          defaultValue={persona?.communicationSample ?? ""}
        />
      </label>
    </div>
  );
}
