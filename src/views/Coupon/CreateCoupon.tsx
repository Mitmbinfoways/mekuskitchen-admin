import { Button, Checkbox, Label, Textarea, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { CreateCoupon, EditCoupons, UploadImage } from 'src/AxiosConfig/AxiosConfig';
import MultiSelect from 'src/components/MultiSelect';
import { RootState } from 'src/Store/Store';

interface SubSubCategoryType {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SubCategoryType {
  _id: string;
  name: string;
  isActive: boolean;
  subSubCategories: SubSubCategoryType[];
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryType {
  _id: string;
  name: string;
  subCategories: SubCategoryType[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CouponFormData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  minOrderAmount: string;
  startAt: string;
  expiresAt: string;
  usageLimit: string;
  image: string;
  isActive: boolean;
  termsAndConditions: string;
  description: string;
  category: string[];
  subCategory: string[];
  productCategory: string[];
}

interface CreateCouponsProps {
  setShowForm: (show: boolean) => void;
  formData: any;
  setFormData: any;
  onSuccess?: any;
  setIsEdit: any;
  isEdit: boolean;
}

export const CreateCoupons: React.FC<CreateCouponsProps> = ({
  setShowForm,
  setFormData,
  formData,
  setIsEdit,
  isEdit,
  onSuccess,
}) => {
  const categories = useSelector((state: RootState) => state.category.categoryList);
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategoryType[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const handleMultiSelectChange = (selected: string[], field: keyof CouponFormData) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: selected,
      ...(field === 'category' && { subCategory: [], productCategory: [] }),
      ...(field === 'subCategory' && { productCategory: [] }),
    }));

    if (field === 'category') {
      const selectedCategories = categories.filter((cat) => selected.includes(cat.name));
      const newSubCategories = selectedCategories.flatMap((cat) => cat.subCategories);
      setSubCategories(newSubCategories);
      setSubSubCategories([]);
    } else if (field === 'subCategory') {
      const selectedSubCategories = subCategories.filter((sub) => selected.includes(sub.name));
      const newSubSubCategories = selectedSubCategories.flatMap((sub) => sub.subSubCategories);
      setSubSubCategories(newSubSubCategories);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const requiredNumbers = ['discountValue', 'minOrderAmount', 'usageLimit'];
      for (const field of requiredNumbers) {
        if (!formData[field] || Number(formData[field]) <= 0) {
          return;
        }
      }

      const startDate = new Date(formData.startAt);
      const endDate = new Date(formData.expiresAt);
      if (endDate < startDate) {
        return;
      }

      let uploadedImageUrl = '';
      if (formData.image && typeof formData.image !== 'string') {
        const uploadResult = await UploadImage([formData.image]);
        uploadedImageUrl = uploadResult?.data?.data?.images[0]?.url || '';
      }

      const data = new FormData();
      data.append('code', formData.code);
      data.append('discountType', formData.discountType);
      data.append('discountValue', formData.discountValue);
      data.append('minOrderAmount', formData.minOrderAmount);
      data.append('startAt', new Date(formData.startAt).toISOString());
      data.append('expiresAt', new Date(formData.expiresAt).toISOString());
      data.append('usageLimit', formData.usageLimit);
      data.append('isActive', String(formData.isActive));
      data.append('termsAndConditions', formData.termsAndConditions);
      data.append('description', formData.description);
      data.append(
        'image',
        uploadedImageUrl || (typeof formData.image === 'string' ? formData.image : ''),
      );

      ['category', 'subCategory', 'productCategory'].forEach((key) => {
        formData[key]?.forEach((val: string) => {
          data.append(`${key}[]`, val);
        });
      });

      if (isEdit && formData._id) {
        const Editdata = {
          couponId: formData._id,
          ...data,
        };
        await EditCoupons(Editdata);
      } else {
        await CreateCoupon(data);
      }

      onSuccess?.();
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        startAt: '',
        expiresAt: '',
        usageLimit: '',
        image: '',
        isActive: true,
        termsAndConditions: '',
        description: '',
        category: [],
        subCategory: [],
        productCategory: [],
      });
      setIsEdit(false);
      setShowForm(false);
    } catch (error) {
      console.error('Coupon submission failed:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Create New Coupon</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code" value="Coupon Code" />
            <TextInput
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="e.g., SAVE10"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="discountType" value="Discount Type" />
            <select
              id="discountType"
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              className="border rounded-md p-2"
              required
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="discountValue" value="Discount Value" />
            <TextInput
              id="discountValue"
              name="discountValue"
              type="number"
              value={formData.discountValue}
              onChange={handleInputChange}
              placeholder="e.g., 25"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="minOrderAmount" value="Minimum Order Amount" />
            <TextInput
              id="minOrderAmount"
              name="minOrderAmount"
              type="number"
              value={formData.minOrderAmount}
              onChange={handleInputChange}
              placeholder="e.g., 500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="startAt" value="Start Date" />
            <TextInput
              id="startAt"
              name="startAt"
              type="date"
              value={formData.startAt}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="expiresAt" value="Expiration Date" />
            <TextInput
              id="expiresAt"
              name="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="usageLimit" value="Usage Limit" />
            <TextInput
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="1"
              value={formData.usageLimit}
              onChange={handleInputChange}
              placeholder="e.g., 100"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image" value="Image" />
            <input
              type="file"
              id="image"
              name="image"
              className="border rounded-md p-2"
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  image: e.target.files?.[0] || '',
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MultiSelect
            id="category"
            label="Category"
            options={categories.map((cat: CategoryType) => cat.name)}
            selectedValues={formData.category}
            onChange={(selected) => handleMultiSelectChange(selected, 'category')}
            required
          />
          <MultiSelect
            id="subCategory"
            label="Sub Category"
            options={subCategories.map((sub: SubCategoryType) => sub.name)}
            selectedValues={formData.subCategory}
            onChange={(selected) => handleMultiSelectChange(selected, 'subCategory')}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MultiSelect
            id="productCategory"
            label="Product Category"
            options={subSubCategories.map((subSub: SubSubCategoryType) => subSub.name)}
            selectedValues={formData.productCategory}
            onChange={(selected) => handleMultiSelectChange(selected, 'productCategory')}
            required
          />
          <div className="flex items-start sm:items-center gap-3 mt-2 sm:mt-6">
            <Checkbox id="isActive" checked={formData.isActive} onChange={handleCheckboxChange} />
            <Label htmlFor="isActive" value="Is Active" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="termsAndConditions" value="Terms and Conditions" />
            <Textarea
              id="termsAndConditions"
              name="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={handleInputChange}
              placeholder="e.g., Valid only on selected items."
              rows={4}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Save 25% on orders above ₹500 this May!"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <Button color="gray" onClick={() => setShowForm(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button color="blue" type="submit" className="w-full sm:w-auto">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupons;
