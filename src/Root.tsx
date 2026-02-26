/*import { useState, useEffect } from "react";
import { Link } from "react-router";
importfahrah { PokeAPI } from "./api";
*/

import { useState, useEffect } from "react";
import { PokeAPI } from "./api";

interface Props {
  id: number;
  image: string;
  name: string;
  types: string[];
  stats?: Array<{ name: string; value: number }>;
}

   
// pokemon-style card variant for highlighting specific pokemon
export const PokemonCard: React.FC<Props & { onClick: () => void }> = ({ id, image, name, types, onClick }) => {
  const mainType = types[0] || "normal";
  const borderColor = (typeColors[mainType] || "bg-gray-300").replace("bg-", "border-");

  return (
    <div
      onClick={onClick}
      className={
        `relative w-60 h-80 bg-white border-4 ${borderColor} rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2`
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
          className="max-h-40 object-contain transition-transform duration-300 hover:scale-110"
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
  const [pokemons, setPokemons] = useState<Props[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<(Props & { fullStats?: Array<{ name: string; value: number }> }) | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);

  // ID dei pokemon leggendari, mitici e dei
  const legendaryPokemonIds = [
    144, 145, 146, 150, 151, // Gen 1: Articuno, Zapdos, Moltres, Mewtwo, Mew
    243, 244, 245, 249, 250, 251, // Gen 2: Raikou, Entei, Suicune, Lugia, Ho-Oh, Celebi
    377, 378, 379, 380, 381, 382, 383, 384, 385, 386, // Gen 3: Regirock, Regice, Registeel, Latias, Latios, Kyogre, Groudon, Rayquaza, Jirachi, Deoxys
    483, 484, 487, 488, 490, 491, 492, 493, // Gen 4: Dialga, Palkia, Giratina, Cresselia, Manaphy, Darkrai, Shaymin, Arceus
    516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, // Gen 5 legendary/mythic
    649, // Gen 5: Genesect
    716, 717, 718, 719, 720, 721, // Gen 6: Xerneas, Yveltal, Zygarde, Diancie, Hoopa, Volcanion
    785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, // Gen 7
    803, 804, 805, 806, // Gen 7 Cont
    888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 900, 901, 902, // Gen 8
  ];

  const fetchLegendaryPokemons = async (currentCount: number = 0) => {
    setLoading(true);
    try {
      const startIndex = currentCount;
      const endIndex = startIndex + 20; 
      const pokemonIdsToFetch = legendaryPokemonIds.slice(startIndex, endIndex);

      const pokemonData = await Promise.all(
        pokemonIdsToFetch.map(async (id: number) => {
          try {
            const pokemon = await PokeAPI.getPokemonById(id);
            return {
              id: pokemon.id,
              image: pokemon.sprites.other?.["official-artwork"].front_default ?? "",
              name: pokemon.name,
              types: pokemon.types.map((type: any) => type.type.name),
              fullStats: pokemon.stats?.map((stat: any) => ({
                name: stat.stat.name,
                value: stat.base_stat,
              })) || [],
            };
          } catch (error) {
            console.error(`Error fetching pokemon ${id}:`, error);
            return null;
          }
        }),
      );
      
      const validPokemon = pokemonData.filter((p) => p !== null);
      setPokemons((prev) => [...prev, ...validPokemon]);
      setLoadedCount(endIndex);
    } catch (error) {
      console.error("Error fetching legendary pokemons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Non carica nulla all'inizio
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPokemon(null);
      }
    };
    
    if (selectedPokemon) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [selectedPokemon]);

  return (
    <div className="p-8">
      <div className="flex flex-wrap gap-6 justify-start">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            image={pokemon.image}
            name={pokemon.name}
            types={pokemon.types}
            onClick={() => setSelectedPokemon(pokemon)}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => fetchLegendaryPokemons(loadedCount)}
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-all duration-300"
        >
          {loading ? "Caricamento..." : "Carica altri pokemon leggendari"}
        </button>
      </div>

      {/* Modal con statistiche */}
      {selectedPokemon && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setSelectedPokemon(null)}
        >
          <div 
            className="rounded-2xl shadow-2xl max-w-2xl w-full animate-slideUp max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: getTypeHexColor(selectedPokemon.types[0] || "normal"),
            }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold capitalize text-white drop-shadow-lg">{selectedPokemon.name}</h2>
                <button
                  onClick={() => setSelectedPokemon(null)}
                  className="text-white hover:text-gray-100 text-2xl font-bold drop-shadow"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-8 flex-col md:flex-row">
                {/* Immagine */}
                <div className="flex-shrink-0 flex justify-center md:justify-start">
                  <img
                    src={selectedPokemon.image}
                    alt={selectedPokemon.name}
                    className="w-48 h-48 object-contain animate-bounce bg-white bg-opacity-20 rounded-lg p-4"
                  />
                </div>

                {/* Statistiche */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-4 drop-shadow">Statistiche</h3>
                  <div className="space-y-3">
                    {selectedPokemon.fullStats?.map((stat: any) => (
                      <div key={stat.name} className="flex items-center gap-3">
                        <span className="w-24 font-semibold text-white capitalize drop-shadow">{stat.name}</span>
                        <div className="flex-1 bg-white bg-opacity-30 rounded-full h-6 overflow-hidden border border-white border-opacity-50">
                          <div
                            className="bg-gradient-to-r from-yellow-300 to-white h-full flex items-center justify-center text-gray-900 text-sm font-bold transition-all duration-500"
                            style={{ width: `${Math.min(stat.value, 150)}%` }}
                          >
                            {stat.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tipi */}
                  <div className="mt-6">
                    <h4 className="font-bold text-white mb-2 drop-shadow">Tipi</h4>
                    <div className="flex gap-2">
                      {selectedPokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`font-bold text-white px-4 py-2 rounded-full text-sm ${getTypeColor(type)} opacity-90 drop-shadow`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
}
function getTypeColor(type: string): string {
  return typeColors[type];
}

function getTypeHexColor(type: string): string {
  return typeHexColors[type] || "#9ca3af";
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

const typeHexColors: { [key: string]: string } = {
  fire: "#ef4444",
  water: "#3b82f6",
  grass: "#22c55e",
  electric: "#facc15",
  psychic: "#ec4899",
  ice: "#06b6d4",
  dragon: "#6b21a8",
  dark: "#374151",
  fairy: "#fbbbf9",
  normal: "#9ca3af",
  fighting: "#b91c1c",
  flying: "#818cf8",
  poison: "#a855f7",
  ground: "#ca8a04",
  rock: "#92400e",
  bug: "#15803d",
  ghost: "#5b21b6",
  steel: "#6b7280",
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