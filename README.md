# Github-Pages-Naming-Convention-Generator

A naming convention generator for Github Pages.

## Getting Started

1. **Create Your Own Repository**
   - Click the **"Use this template"** button at the top of this repository on GitHub to create a new repo with the same structure. [Learn more about using repository templates](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).
   - Alternatively, you can fork or clone the repository.

2. **Modify the templates**
   - Edit `templates.json` in the root directory to define your own naming conventions.
   - Each template can include:
     - `id`: Unique identifier for the template
     - `name`: Display name
     - `description`: Short description
     - `template`: The output format using `{{FieldName}}` placeholders. Other characters will be static items in your template (think dashes, brackets or prefixes)
     - `fields`: Array of field objects, each with:
       - `key`: Field variable name (must match placeholder exactly in template)
       - `type`: `dropdown`, `text`, or `checkbox`
       - `label`: Field label for the form
       - `required`: (optional) true/false for required fields. Exclude this if you don't need it, or want no * indication of required.
       - `options`: (for dropdown) array of `{ value, label }` pairs

   - See the provided `templates.json` for examples.

3. **Publish with GitHub Pages**
   - Go to your repository settings > Pages.
   - Set the source branch to `main` (or your default branch).
   - Set the folder to `/ (root)`.
   - Save and wait for the site to deploy.

   > **Note:** If you use a custom folder (like `docs/`), move all files (including `templates.json`) into that folder and update the fetch path in `main.js` accordingly.

4. **Enterprise/Private Use**
   - Change repository visibility to private/internal if needed.

## Customization

- You can style the app by editing `style.css`.
- Update `README.md` and `templates.json` to document your own conventions.

## Example Field Options

- `type` can be `dropdown`, `text`, or `checkbox`.
- `options` is required for dropdowns.
- Use `required: true` for mandatory fields. It just adds a visual indication of required.

**dropdown** example:

```json
{
  "key": "Department",
  "type": "dropdown",
  "label": "Department",
  "required": true,
  "options": [
    {"value": "IT", "label": "Information Technology"},
    {"value": "HR", "label": "Human Resources"}
  ]
}
```

**text** example:

```json
{
  "key": "ID",
  "type": "text",
  "label": "Unique Identifier",
  "required": true
}
```

**checkbox** example:

```json
{
  "key": "Production",
  "type": "checkbox",
  "label": "In Production?"
}
```

> **Note:** "required": true can be used, but checkbox items are inherently optional, so static text would probably be used in that case.

## Additional Regex filters for nicer looking output

- See `main.js` in the function `updateLiveOutput` where result is replaced. Addl regex can be added there.
