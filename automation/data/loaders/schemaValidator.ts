import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const cache = new Map<string, ReturnType<typeof ajv.compile>>();

export function validateWithSchema(
  schemaFileName: string,
  data: unknown,
): { valid: boolean; errors: string[] } {
  const schemaPath = path.join(__dirname, "..", "schemas", schemaFileName);
  if (!cache.has(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    cache.set(schemaPath, ajv.compile(schema));
  }
  const validate = cache.get(schemaPath)!;
  const valid = validate(data);
  const errors = (validate.errors ?? []).map(
    (e) => `${e.instancePath} ${e.message}`,
  );
  return { valid: !!valid, errors };
}

