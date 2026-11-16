import { getProfileUrl } from '../../utils';

const PersonCreditCard = ({ person, subtitle, variant, onSelect }) => {
  const itemClass = variant === 'crew' ? 'crew-item' : 'cast-item';
  const picClass = variant === 'crew' ? 'crew-profile-pic' : 'cast-profile-pic';
  const placeholderClass =
    variant === 'crew' ? 'crew-profile-pic-placeholder' : 'cast-profile-pic-placeholder';
  const infoClass = variant === 'crew' ? 'crew-info' : 'cast-info';
  const subtitleClass = variant === 'crew' ? 'crew-job' : 'cast-character';

  return (
    <div
      className={`${itemClass} clickable-person-card`}
      onClick={() => onSelect(person)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onSelect(person);
        }
      }}
      title={`View ${person.name}`}
    >
      {person.profile_path ? (
        <img
          src={getProfileUrl(person.profile_path)}
          alt={person.name}
          className={picClass}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className={placeholderClass} style={{ display: person.profile_path ? 'none' : 'flex' }}>
        <span>{person.name.charAt(0)}</span>
      </div>
      <div className={infoClass}>
        <button
          className="person-link-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(person);
          }}
          title={`View ${person.name}`}
        >
          {person.name}
        </button>
        <div className={subtitleClass}>{subtitle}</div>
      </div>
    </div>
  );
};

export default PersonCreditCard;
