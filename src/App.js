import { useState } from "react";

function App() {
  const [Friendform, setFriendform] = useState(false);
  //STATE FOR COLLECTING FORM DATA
  const [friend, setFriend] = useState([
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: -7,
    },
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
    },
    {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ]);
  const [curfriend, setCurfriend] = useState(null);
  const [splitdata, setsplitdata] = useState(false);

  function controlclosebtn() {
    setFriendform((s) => !s);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          setsplitdata={setsplitdata}
          curfriend={curfriend}
          setCurfriend={setCurfriend}
          friend={friend}
          onsetfriend={setFriendform}
        />
        <FormAddFriend
          friend={friend}
          onsetfriend={setFriend}
          friendform={Friendform}
          onfriendform={setFriendform}
        />
        <Button onfriendform={controlclosebtn}>
          {Friendform ? "close" : "Add friend"}
        </Button>
      </div>
      <FormSplitBill
        onsetfriend={setFriend}
        setCurfriend={setCurfriend}
        setsplitdata={setsplitdata}
        splitdata={splitdata}
        key={splitdata.id}
      />
    </div>
  );
}

function FriendsList({ friend, curfriend, setCurfriend, setsplitdata, onsetfriend }) {
  return (
    <ul>
      {friend.map((friends) => (
        <Friend
          friend={friends}
          key={friends.id}
          setCurfriend={setCurfriend}
          curfriend={curfriend}
          setsplitdata={setsplitdata}
          onsetfriend= {onsetfriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, setCurfriend, curfriend, setsplitdata,onsetfriend }) {
  function handlesubmit() {
    if (handledisplay === true) {
      setCurfriend(null);
      setsplitdata(null);
      return;
    }

    setCurfriend(friend.id);
    setsplitdata(friend);
    onsetfriend(false)
  }

  let handledisplay = curfriend === friend.id;

  return (
    <li>
      <img src={friend.image} alt="userAvatar" />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${-friend.balance}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onfriendform={handlesubmit}>
        {handledisplay ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onfriendform }) {
  return (
    <button onClick={onfriendform} className="button">
      {" "}
      {children}
    </button>
  );
}

function FormAddFriend({ friendform, onfriendform, friend, onsetfriend }) {
  const [name, setName] = useState("");
  const image = "https://i.pravatar.cc/48?u=118836";

  function handleSubmit(e) {
    e.preventDefault();
    if(!name || !image) return
    const newData = {
      id: Date.now(),
      name,
      image,
      balance: 0,
    };
    onsetfriend((friends) => [...friends, newData]);
    console.log(friend);
    onfriendform((s) => !s);
  }
  return (
    friendform && (
      <form onSubmit={handleSubmit} className="form-add-friend">
        <label>😎Friend Name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
        />

        <label>🌆Image url</label>
        <input value={image} type="text" />
        <Button>Add</Button>
      </form>
    )
  );
}
function FormSplitBill({ splitdata, setsplitdata, setCurfriend, onsetfriend }) {
  const [billval, setbillval] = useState("");
  const [myexpense, setmyexpense] = useState("");
  const [payer, setpayer] = useState("user");
  const Friendexpense = billval !== "" && myexpense !== "" ? billval - myexpense : ""
  

  function handleSubmit(e) {
    e.preventDefault();
    if(!billval || !myexpense) return
    setsplitdata(null);
    setCurfriend(null);
    if (payer === "user") {
      onsetfriend((friends) =>
        friends.map((friend) =>
          friend.id === splitdata.id
            ? { ...friend, balance: Friendexpense + friend.balance  }
            : friend
        )
      );
    }
    if (payer === "friend") {
      onsetfriend((friends) =>
        friends.map((friend) =>
          friend.id === splitdata.id
            ? { ...friend, balance: -myexpense + friend.balance  }
            : friend
        )
      );
    }
    setmyexpense("");
    setbillval("");
  }

  return (
    splitdata && (
      <form onSubmit={(e) => handleSubmit(e)} className="form-split-bill">
        <h2>Split a bill with {splitdata.name}</h2>
        <label>💸 Bill Value</label>
        <input
          onChange={(e) => setbillval(+e.target.value)}
          value={billval}
          type="number"
        />
        <label> 🕴️ Your Expense</label>
        <input
          onChange={(e) => setmyexpense(+e.target.value > billval || !billval ? myexpense : +e.target.value)}
          value={myexpense}
          type="number"
        />
        <label>🧑🏻‍🤝‍🧑🏻 {splitdata.name} Expense </label>
        <input value={Friendexpense}   type="text" disabled />
        <label>💵 Who is paying the bill</label>
        <select onChange={(e) => setpayer(e.target.value)} value={payer}>
          <option value="user">You</option>
          <option value="friend"> {splitdata.name}</option>
        </select>
        <Button>Split Bill</Button>
      </form>
    )
  );
}

export default App;
