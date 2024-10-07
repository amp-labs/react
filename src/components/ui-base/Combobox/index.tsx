import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';

import classes from './combobox.module.css';

const items = ['Apple', 'Banana', 'Orange', 'Grape'];

export function Combobox() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredItems = items.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setOpen(true)}
            placeholder={selectedItem || 'Select a fruit'}
            className="combobox-input"
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={classes.comboboxContent} sideOffset={5}>
            <ul>
              {filteredItems.map((item, index) => (
                // eslint-disable-next-line max-len
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <li
                  key={index}
                  onClick={() => {
                    setSelectedItem(item);
                    setSearchTerm(item);
                    setOpen(false);
                  }}
                  className={classes.comboboxItem}
                >
                  {item}
                </li>
              ))}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
