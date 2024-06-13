function Blocks({ clickHandler, value }) {
  return (
    <div key={Math.random()} onClick={() => clickHandler()} className="block">
      {value}
    </div>
  );
}

export default Blocks;
