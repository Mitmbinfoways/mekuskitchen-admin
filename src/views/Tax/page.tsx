'use client';
import { Button, TextInput, Label, Select } from 'flowbite-react';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { CreateTax, DeleteTax, EditTax, getallTax } from 'src/AxiosConfig/AxiosConfig';
import { RootState } from 'src/Store/Store';

interface TaxEntry {
  category: string;
  provinceTax: string;
  federalTax: string;
}

interface TaxConfig {
  _id?: string;
  provinceName: string;
  provinceCode: string;
  taxes: { category: string; provinceTax: number; federalTax: number }[];
}

interface CategoryType {
  _id: string;
  name: string;
}

const Page = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [provinceCode, setProvinceCode] = useState<string>('');
  const [provinceName, setProvinceName] = useState<string>('');
  const [taxes, setTaxes] = useState<TaxEntry[]>([
    { category: '', provinceTax: '', federalTax: '' },
  ]);
  const [taxConfigs, setTaxConfigs] = useState<TaxConfig[]>([]);

  const categoryList: CategoryType[] = useSelector(
    (state: RootState) => state.category.categoryList,
  );

  const fetchTax = async () => {
    try {
      const data = {
        provinceCode: '',
        category: '',
      };
      const response = await getallTax(data);
      setTaxConfigs(response.data.data);
    } catch (error) {
      console.log(error);
      console.error('Fetch Tax Error:', error);
    }
  };

  const handleAddTaxField = () => {
    setTaxes((prev) => [...prev, { category: '', provinceTax: '', federalTax: '' }]);
  };

  const handleRemoveTaxField = (index: number) => {
    setTaxes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTaxChange = (index: number, field: keyof TaxEntry, value: string) => {
    setTaxes((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !provinceName ||
      !provinceCode ||
      taxes.some((t) => !t.category || !t.provinceTax || !t.federalTax)
    ) {
      return;
    }

    const payload: TaxConfig = {
      provinceName,
      provinceCode,
      taxes: taxes.map((t) => ({
        category: categoryList.find((cat) => cat._id === t.category)?.name || t.category,
        provinceTax: parseFloat(t.provinceTax),
        federalTax: parseFloat(t.federalTax),
      })),
    };

    try {
      if (editId) {
        await EditTax(payload);
      } else {
        await CreateTax(payload);
      }

      setProvinceCode('');
      setProvinceName('');
      setTaxes([{ category: '', provinceTax: '', federalTax: '' }]);
      setShowForm(false);
      setEditId(null);
      await fetchTax();
    } catch (error) {
      console.error(`${editId ? 'Update' : 'Create'} Tax Error:`, error);
    }
  };

  const handleEdit = (config: TaxConfig) => {
    setEditId(config?._id ?? null);
    setProvinceName(config.provinceName);
    setProvinceCode(config.provinceCode);
    setTaxes(
      config.taxes.map((t) => ({
        category: categoryList.find((cat) => cat.name === t.category)?._id || '',
        provinceTax: t.provinceTax.toString(),
        federalTax: t.federalTax.toString(),
      })),
    );
    setShowForm(true);
  };

  const handleDelete = async (name: string) => {
    try {
      await DeleteTax(name);
      fetchTax();
    } catch (error) {
      console.error('Delete Tax Error:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setProvinceCode('');
    setProvinceName('');
    setTaxes([{ category: '', provinceTax: '', federalTax: '' }]);
  };

  useEffect(() => {
    fetchTax();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Tax</h2>
          <Button size="sm" color="blue" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? 'Cancel' : 'Create Tax'}
          </Button>
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provinceName" value="Province Name" />
                <TextInput
                  id="provinceName"
                  required
                  value={provinceName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProvinceName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="provinceCode" value="Province Code" />
                <TextInput
                  id="provinceCode"
                  required
                  value={provinceCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProvinceCode(e.target.value)}
                />
              </div>
            </div>

            <div>
              {taxes.map((tax, index) => (
                <div key={index} className="flex items-center gap-4 mt-2">
                  <div className="flex flex-col gap-2">
                    <Label value="Select Category" />
                    <Select
                      required
                      value={tax.category}
                      onChange={(e) => handleTaxChange(index, 'category', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categoryList.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label value="Province Tax (%)" />
                    <TextInput
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={tax.provinceTax}
                      onChange={(e) => handleTaxChange(index, 'provinceTax', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label value="Federal Tax (%)" />
                    <TextInput
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={tax.federalTax}
                      onChange={(e) => handleTaxChange(index, 'federalTax', e.target.value)}
                    />
                  </div>
                  {taxes.length > 1 && (
                    <div className="flex items-end pt-6">
                      <FiX
                        className="text-lg text-red-600 cursor-pointer"
                        onClick={() => handleRemoveTaxField(index)}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                size="xs"
                color="gray"
                className="mt-2"
                onClick={handleAddTaxField}
              >
                <FiPlus className="mr-1" />
                Add Tax
              </Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" color="gray" onClick={handleCancel}>
                Cancel
              </Button>
              <Button color="blue" type="submit">
                {editId ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="w-full">
            {taxConfigs?.length === 0 ? (
              <p className="text-gray-500">No tax configurations found.</p>
            ) : (
              <ul className="bg-white shadow-md rounded-md">
                {taxConfigs?.map((config) => (
                  <li key={config._id} className="flex flex-col p-4 border-b last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-600 font-semibold">
                          {config.provinceName} ({config.provinceCode})
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div onClick={() => handleEdit(config)}>
                          <MdModeEdit className="text-black cursor-pointer" size={18} />
                        </div>
                        <div onClick={() => handleDelete(config.provinceCode!)}>
                          <MdDelete className="text-red-600 cursor-pointer" size={18} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap mt-2">
                      {config.taxes.map((tax, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-md shadow-sm"
                        >
                          {tax.category}:
                          <span className="text-gray-900">
                            Province: {tax.provinceTax}%, Federal: {tax.federalTax}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
