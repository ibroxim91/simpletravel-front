import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';

Object.values(solidIcons).forEach((icon) => {
  if (typeof icon === 'object' && 'iconName' in icon) {
    library.add(icon as IconDefinition);
  }
});
