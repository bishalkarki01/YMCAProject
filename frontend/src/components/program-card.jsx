export const ProgramCard = (props) => {
    const {name, desc, image, url} = props;
    return (
        <div className="program-item">
            <h2 className="program-name">{name}</h2>
            <p className="program-description">{desc}</p>
            <img className="program-image" src={image} />
            <button className="program-button">
            <a href={url} target="_blank">Read more</a>
            </button>
        </div>
    )
}