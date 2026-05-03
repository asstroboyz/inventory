export function uniqueArray(a) {
    return a.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.value === value.value
        ))
    )
}
