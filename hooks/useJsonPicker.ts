import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { useCallback, useState } from 'react';

type Validation<T> = { ok: true; data: T } | { ok: false; error: string };

type Picked<T> = { name: string; data: T };

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** Lê o arquivo como texto: tenta fetch (file://) e, se falhar, a API File do expo-file-system. */
async function readText(uri: string): Promise<string> {
  try {
    const res = await fetch(uri);
    return await res.text();
  } catch {
    return await new File(uri).text();
  }
}

/**
 * Seleciona arquivo(s) .json, lê o conteúdo e valida a estrutura.
 * Só marca como válido se TODOS os arquivos escolhidos passarem na validação.
 */
export function useJsonPicker<T>(
  validate: (raw: unknown) => Validation<T>,
  options: { multiple?: boolean } = {},
) {
  const [files, setFiles] = useState<Picked<T>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pick = useCallback(async () => {
    setError(null);

    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
      multiple: options.multiple ?? false,
    });
    if (result.canceled) return;

    const picked: Picked<T>[] = [];

    for (const asset of result.assets) {
      if (!asset.name.toLowerCase().endsWith('.json')) {
        setFiles([]);
        setError(`"${asset.name}" não é um arquivo .json.`);
        return;
      }

      let text: string;
      try {
        text = await readText(asset.uri);
      } catch (e) {
        setFiles([]);
        setError(`Não consegui ler "${asset.name}": ${errorMessage(e)}`);
        return;
      }

      let raw: unknown;
      try {
        // remove BOM, caso exista
        raw = JSON.parse(text.replace(/^﻿/, ''));
      } catch (e) {
        setFiles([]);
        setError(`"${asset.name}" não é um JSON válido: ${errorMessage(e)}`);
        return;
      }

      const validation = validate(raw);
      if (!validation.ok) {
        setFiles([]);
        setError(`${asset.name}: ${validation.error}`);
        return;
      }

      picked.push({ name: asset.name, data: validation.data });
    }

    setFiles(picked);
  }, [validate, options.multiple]);

  const reset = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  return { files, error, isValid: files.length > 0, pick, reset };
}
