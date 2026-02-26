/*import { useState, useEffect } from "react";
import { Link } from "react-router";
import { PokeAPI } from "./api";
*/

interface Props {
  id: number;
  image: string;
  name: string;
  types: string[];
}

// pokemon-style card variant for highlighting specific pokemon
export const PokemonCard: React.FC<Props> = ({ id, image, name, types }) => {
  const mainType = types[0] || "normal";
  const borderColor = (typeColors[mainType] || "bg-gray-300").replace("bg-", "border-");

  return (
    <div
      className={
        `relative w-60 h-80 bg-white border-4 ${borderColor} rounded-lg shadow-lg overflow-hidden`
      }
    >
      {/* header: name left, id and primary type right */}
      <div className="absolute top-0 w-full bg-gray-100 px-3 py-1 flex justify-between items-center">
        <span className="font-bold text-lg capitalize truncate">{name}</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">#{id}</span>
          <span className={`text-xs font-bold text-white px-1 py-0.5 rounded ${getTypeColor(mainType)}`}>{mainType}</span>
        </div>
      </div>

      {/* artwork area */}
      <div className="absolute top-12 left-0 right-0 bottom-24 flex justify-center items-center">
        <img
          src={image}
          alt={name}
          className="max-h-40 object-contain"
        />
      </div>

      {/* types badges at bottom center */}
      <div className="absolute bottom-1 w-full flex justify-center space-x-2">
        {types.map((type) => (
          <span
            key={type}
            className={`font-bold text-white px-2 py-1 rounded text-xs ${getTypeColor(type)}`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};


export const Card: React.FC<Props> = (props) => (
  <div className="bg-white border border-gray-300 rounded-lg shadow-md relative w-2xs flex items-center justify-center h-80">
    <h4 className="text-xl text-gray-900 tracking-wide font-bold absolute left-4 top-2">
      {props.name} -{" "}
      <span className="text-gray-700 font-medium">{props.id}</span>
    </h4>

    <img
      src={props.image}
      alt={props.name}
      className="w-36 h-36 object-contain"
    />

    <div className="text-sm text-gray-700 absolute right-2 bottom-2">
      <div className="flex justify-center space-x-2">
        {props.types.map((type) => (
          <span
            key={type}
            className={`font-bold text-white px-3 py-1 rounded-md text-xs ${getTypeColor(type)}`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export function Root() {
  // display Regigas and Arceus side-by-side with the same styling
  return (
    <div className="p-8 flex flex-wrap gap-6 justify-start">
      <PokemonCard
        id={486} // Regigas national pokédex number
        image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/486.png"
        name="Regigas"
        types={["normal"]}
      />
      <PokemonCard
        id={493} // Arceus national pokédex number
        image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/493.png"
        name="Arceus"
        types={["normal"]}
      />
      <PokemonCard
        id={484} // Palkia national pokédex number
        image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/484.png"
        name="Palkia"
        types={["water", "dragon"]}
      />
      <PokemonCard
        id={483} // Dialga national pokédex number
        image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/483.png"
        name="Dialga"
        types={["steel", "dragon"]}
      />
    </div>
  );
}
function getTypeColor(type: string): string {
  return typeColors[type];
}

const typeColors: { [key: string]: string } = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  psychic: "bg-pink-500",
  ice: "bg-cyan-400",
  dragon: "bg-purple-700",
  dark: "bg-gray-700",
  fairy: "bg-pink-300",
  normal: "bg-gray-400",
  fighting: "bg-red-700",
  flying: "bg-indigo-400",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  rock: "bg-yellow-800",
  bug: "bg-green-700",
  ghost: "bg-indigo-700",
  steel: "bg-gray-500",
};

/*
interface PokemonCard {
  id: number;
  image: string;
  name: string;
  types: string[];
}

async function fetchData(offset: number): Promise<PokemonCard[]> {
  const list = await PokeAPI.listPokemons(offset, 20);
  const pokemons = await Promise.all(
    list.results.map(async (item: { name: string; url: string }) => {
      const pokemon = await PokeAPI.getPokemonByName(item.name);
      return pokemon;
    }),
  );

  return pokemons.map((item) => ({
    id: item.id,
    image: item.sprites.other?.["official-artwork"].front_default ?? "",
    name: item.name,
    types: item.types.map((type) => type.type.name),
  }));
}*/