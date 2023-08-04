import { Fragment, useEffect, useState } from "react";
import "./App.css";
import Blocks from "./components/Blocks";

!get("skill") ? set("skill") : "";

function set(key, value) {
  localStorage.setItem(key, value);
}

function get(key) {
  localStorage.setItem(key);
}

let blocks = [
  {
    value: "",
  },
  {
    value: "",
  },
  {
    value: "",
  },
  {
    value: "",
  },
  {
    value: "",
  },
  {
    value: "",
  },
  {
    value: "",
  },
  {
    value: "",
  },
  {
    value: "",
  },
];

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

const add_icon_variants = [
  {
    set_icon: 0,
    positions: [
      [3, 6],
      [1, 2],
      [4, 8],
    ],
    added: "false",
  },
  {
    set_icon: 1,
    positions: [
      [0, 2],
      [4, 7],
    ],
    added: "false",
  },
  {
    set_icon: 2,
    positions: [
      [0, 1],
      [5, 8],
      [4, 6],
    ],
    added: "false",
  },
  {
    set_icon: 3,
    positions: [
      [4, 5],
      [0, 6],
    ],
    added: "false",
  },
  {
    set_icon: 4,
    positions: [
      [3, 5],
      [1, 7],
      [0, 8],
    ],
    added: "false",
  },
  {
    set_icon: 5,
    positions: [
      [3, 4],
      [2, 8],
    ],
    added: "false",
  },
  {
    set_icon: 6,
    positions: [
      [7, 8],
      [0, 3],
      [2, 4],
    ],
    added: "false",
  },
  {
    set_icon: 7,
    positions: [
      [6, 8],
      [1, 4],
    ],
    added: "false",
  },
  {
    set_icon: 8,
    positions: [
      [6, 7],
      [2, 5],
      [0, 4],
    ],
    added: "false",
  },
];

let winner = "";

function App() {
  const [user, setUser] = useState("x");
  const [selected_user, setSelected_user] = useState("x");
  const [selecting_user, setSelecting_user] = useState(selected_user);
  const [blocks_arr, setBlocks_arr] = useState(blocks);
  let ai = "o";
  useEffect(() => {
    if (selected_user == "x") {
      ai = "o";
    } else {
      ai = "x";
    }
    if (blocks_arr.every((block) => block.value != "")) {
      restart();
    }
    if (user == ai) {
      analysis();
    }
  }, [user]);
  function checkWinner(value) {
    if (
      win_variants.some((variant_list) =>
        variant_list.every((variant) => blocks_arr[variant].value == value)
      )
    ) {
      winner = value;
      return true;
    }
  }
  function restart() {
    setUser("x");
    setSelected_user(selecting_user);
    blocks_arr.forEach((block) => {
      block.value = "";
    });
    winner = "";
  }
  function analysis() {
    let result_index = 0;
    setTimeout(() => {
      let count = 0;
      if (
        add_icon_variants.filter(
          (data) =>
            data.added == "false" &&
            count == 0 &&
            data.positions.some(
              (coordinate) =>
                coordinate.every(
                  (index) => blocks_arr[index].value == selected_user
                ) || coordinate.every((index) => blocks_arr[index].value == ai)
            )
        )[0]
      ) {
        add_icon_variants.forEach((data) => {
          if (
            data.added == "false" &&
            count == 0 &&
            data.positions.some((coordinate) =>
              coordinate.every((index) => blocks_arr[index].value == ai)
            )
          ) {
            if (blocks_arr[data.set_icon].value == "") {
              data.added = "true";
              result_index = data.set_icon;
              count += 1;
            }
          } else if (
            data.added == "false" &&
            count == 0 &&
            data.positions.some((coordinate) =>
              coordinate.every(
                (index) => blocks_arr[index].value == selected_user
              )
            )
          ) {
            if (blocks_arr[data.set_icon].value == "") {
              result_index = data.set_icon;
              data.added = "true";
              count += 1;
            }
          }
          if (count == 0) {
            if (blocks_arr.filter((block) => block.value == "")[0]) {
              result_index = blocks_arr.indexOf(
                blocks_arr.filter((block) => block.value == "")[0]
              );
            }
          }
        });
      } else if (
        add_icon_variants.filter(
          (data) =>
            data.type == "start attack" &&
            data.added == "false" &&
            count == 0 &&
            data.positions.some(
              (coordinate) =>
                coordinate.every((index) => blocks_arr[index].value == "") ||
                coordinate.every((index) => blocks_arr[index].value == ai)
            )
        )[0]
      ) {
        add_icon_variants
          .filter(
            (data) =>
              data.type == "start attack" &&
              data.added == "false" &&
              count == 0 &&
              data.positions.some((coordinate) =>
                coordinate.every(
                  (index) =>
                    blocks_arr[index].value == "" ||
                    blocks_arr[index].value == ai
                )
              )
          )
          .forEach((data) => {
            if (
              data.added == "false" &&
              count == 0 &&
              data.positions.some((coordinate) =>
                coordinate.every(
                  (index) =>
                    blocks_arr[index].value == "" ||
                    blocks_arr[index].value == ai
                )
              )
            ) {
              if (blocks_arr[data.set_icon].value == "") {
                data.added = "true";
                result_index = data.set_icon;
                count += 1;
              }
            }
          });
      }
      if (blocks_arr[4].value == "") {
        result_index = 4;
      }
      addAi(result_index);
    }, 1000);
  }
  function addAi(index) {
    if (blocks_arr[index].value == "" && winner == "") {
      blocks_arr[index].value = ai;
      checkWinner(ai);
      user == "x" ? setUser("o") : setUser("x");
    }
  }
  function addValue(index) {
    if (blocks_arr[index].value == "" && winner == "") {
      blocks_arr[index].value = user;
      checkWinner(user);
      user == "x" ? setUser("o") : setUser("x");
    }
  }
  return (
    <>
      <h1 className="players_turn">Player: {user}</h1>
      <div className="blocks_wrapper">
        {blocks_arr.map((block, i) => (
          <Blocks value={block.value} clickHandler={() => addValue(i)} id={i} />
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
              onClick={() => restart()}
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
