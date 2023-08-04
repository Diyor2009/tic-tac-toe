function Blocks({clickHandler, value, id}) {
    return (
        <div key={id} onClick={() => clickHandler()} className="block">{value}</div>
    );
};

export default Blocks;