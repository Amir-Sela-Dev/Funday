import { useMemo } from "react";
import { Flex, Dropdown, StoryDescription } from "monday-ui-react-core";

export function DynDropdownSelect() {
    const optionsAvatar = useMemo(() => [{
        value: "Rotem",
        label: "Rotem Dekel",
    }, {
        value: "Hadas",
        label: "Hadas Farhi",
    }, {
        value: "Netta",
        label: "Netta Muller",
    }], []);
    return (
        <Dropdown
            defaultValue={[optionsAvatar[0]]}
            options={optionsAvatar}
            style={base => ({ ...base, color: 'red' })}/>
    )
}