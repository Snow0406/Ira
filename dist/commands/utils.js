export function filterAllCommands(arr) {
    return arr.map((com) => {
        const idx = arrComName.findIndex((v) => v[1] === com.com.name);
        if (idx !== -1) {
            throw Error(`* Duplicated SlashCommand name : ${arrComName[idx][1]} in ${com.constructor.name} & ${arrComName[idx][0]}`);
        }
        arrComName.push([com.constructor.name, com.com.name]);
        console.log(`* slashCommand: Init ${com.constructor.name} as ${com.com.name}`);
        return com;
    });
}
const arrComName = [];
