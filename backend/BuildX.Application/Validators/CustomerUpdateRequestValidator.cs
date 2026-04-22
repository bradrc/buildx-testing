using FluentValidation;
using BuildX.Application.Dtos;

namespace BuildX.Application.Validators;

public class CustomerUpdateRequestValidator : CustomerRequestValidatorBase<CustomerUpdateRequest>
{
    public CustomerUpdateRequestValidator()
    {
        // Common validations are inherited from CustomerRequestValidatorBase
    }
}
