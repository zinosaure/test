function ListDevices() {
    return <App
        content={<Table
            labels={{
                '<i class="fa-solid fa-pencil"></i>':
                    () => `<a onClick="edit_device(this)"><i class="fa-solid fa-pencil"></i></a>`,
                "Fullname": "employee_name",
                "Role": "employee_role",
                '<i class="fa-solid fa-trash"></i>':
                    () => `<a onclick="delete_device(this)"><i class="fa-solid fa-trash"></i></a>`,
            }}
            endpoint={"http://localhost:3000/api/list/devices"}
            callback={(data) => data.devices}
        />}
    />
}