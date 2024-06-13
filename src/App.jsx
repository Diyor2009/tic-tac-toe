import { Fragment, useEffect, useState } from "react";
import "./App.css";
import Blocks from "./components/Blocks";

let blocks = ["", "", "", "", "", "", "", "", ""];

const win_variants = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const moves_conditions = [
  {
    position: 0,
    positions: [
      [3, 6],
      [1, 2],
      [4, 8],
    ],
    added: "false",
  },
  {
    position: 1,
    positions: [
      [0, 2],
      [4, 7],
    ],
    added: "false",
  },
  {
    position: 2,
    positions: [
      [0, 1],
      [5, 8],
      [4, 6],
    ],
    added: "false",
  },
  {
    position: 3,
    positions: [
      [4, 5],
      [0, 6],
    ],
    added: "false",
  },
  {
    position: 4,
    positions: [
      [0, 8],
      [1, 7],
      [2, 6],
      [3, 5],
    ],
    added: "false",
  },
  {
    position: 5,
    positions: [
      [3, 4],
      [2, 8],
    ],
    added: "false",
  },
  {
    position: 6,
    positions: [
      [7, 8],
      [0, 3],
      [2, 4],
    ],
    added: "false",
  },
  {
    position: 7,
    positions: [
      [6, 8],
      [1, 4],
    ],
    added: "false",
  },
  {
    position: 8,
    positions: [
      [6, 7],
      [2, 5],
      [0, 4],
    ],
    added: "false",
  },
];

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function get(key) {
  return JSON.parse(localStorage.getItem(key));
}

var combination_values = [];

function App() {
  const [winner, setWinner] = useState("");
  const [user, setUser] = useState("x");
  const [selected_user, setSelected_user] = useState("x");
  const [selecting_user, setSelecting_user] = useState(selected_user);
  const [blocks_arr, setBlocks_arr] = useState(blocks);
  let aiIcon = selected_user == "x" ? "o" : "x";
  if (!get("combinations")) {
    set("combinations", []);
  }
  useEffect(() => {
    if (selected_user == "x") {
      aiIcon = "o";
    } else {
      aiIcon = "x";
    }

    if (blocks_arr.every((block) => block != "")) {
      checkWinner(user == "x" ? "o" : "xА");
      restart();
    }

    if (user == aiIcon) {
      analysis();
    }
  }, [user]);

  function saveCombination(combination) {
    const last_combinations = get("combinations");
    const new_combinations = [...last_combinations, combination];
    set("combinations", new_combinations);
  }

  function checkWinner(value) {
    if (
      win_variants.some((variant_list) =>
        variant_list.every((index) => blocks_arr[index] == value)
      )
    ) {
      if (value == selected_user) {
        saveCombination(combination_values);
      }
      combination_values = [];
      setWinner(value);
      return true;
    }
  }
  function restart() {
    setUser("x");
    setSelected_user(selecting_user);
    blocks = blocks.map(() => "");
    setBlocks_arr(blocks);

    setWinner("");

    combination_values = [];
    if (selecting_user == "o") {
      analysis();
    }
  }
  function analysis() {
    let result_index = 0;
    const combinations = get("combinations").filter(
      (combination) =>
        combination[0] == combination_values[0] &&
        combination[1] == combination_values[1]
    );
    if (combinations.length && combination_values.length == 2) {
      result_index = combinations[0][2];
    } else {
      let count = 0;
      moves_conditions.forEach((item) => {
        if (item.added == "false" && blocks_arr[item.position] == "") {
          item.positions.forEach((position) => {
            if (
              blocks_arr[position[0]] == aiIcon &&
              blocks_arr[position[1]] == aiIcon
            ) {
              count = 1;
              result_index = item.position;
            }
          });
        }
      });
      moves_conditions.forEach((item) => {
        if (item.added == "false" && blocks_arr[item.position] == "") {
          item.positions.forEach((position) => {
            if (
              blocks_arr[position[0]] == selected_user &&
              blocks_arr[position[1]] == selected_user
            ) {
              count = 1;
              result_index = item.position;
            }
          });
        }
      });
      moves_conditions.forEach((item) => {
        if (item.added == "false" && blocks_arr[item.position] == "") {
          item.positions.forEach((position) => {
            if (
              blocks_arr[position[0]] == aiIcon &&
              blocks_arr[position[1]] == aiIcon
            ) {
              count = 1;
              result_index = item.position;
            }
          });
        }
      });
      if (count == 0) {
        result_index = blocks_arr.indexOf("");
      }
      if (blocks_arr[4] == "") {
        count = 1;
        result_index = 4;
      }
    }
    setTimeout(() => {
      addAi(result_index);
    }, 1000);
  }
  function addAi(index) {
    if (blocks_arr[index] == "" && winner == "") {
      blocks_arr[index] = aiIcon;
      checkWinner(aiIcon);
      user == "x" ? setUser("o") : setUser("x");
    }
  }
  function addValue(index) {
    if (blocks_arr[index] == "" && winner == "" && user == selected_user) {
      blocks_arr[index] = user;
      combination_values.push(index);
      checkWinner(selected_user);
      user == "x" ? setUser("o") : setUser("x");
    }
  }
  return (
    <>
      <h1 className="players_turn">Player: {user}</h1>
      <div className="blocks_wrapper">
        {blocks_arr.map((block, i) => (
          <Blocks value={block} clickHandler={() => addValue(i)} id={i} />
        ))}
      </div>
      <div className={`win_modal_wrapper ${winner != "" ? "showed" : ""}`}>
        <div className="win_modal_content">
          <span className="winner">
            {winner == selected_user ? "You" : `Player "${winner}" is`} win!
          </span>
          <div className="select_turn_wrapper">
            <span className="title">Select Turn</span>
            <div className="icons_wrapper">
              <span
                onClick={() => setSelecting_user("x")}
                className={`icon ${
                  selecting_user == "x" ? "selected_icon" : ""
                }`}
              >
                x
              </span>
              <span
                onClick={() => setSelecting_user("o")}
                className={`icon ${
                  selecting_user == "o" ? "selected_icon" : ""
                }`}
              >
                o
              </span>
            </div>
          </div>
          <div className="restart_wrapper">
            <img
              onClick={restart}
              className="restart_icon"
              src="https://cdn-icons-png.flaticon.com/512/82/82004.png"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
